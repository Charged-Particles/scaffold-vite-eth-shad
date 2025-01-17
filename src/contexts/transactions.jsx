// Frameworks
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { signMessage, simulateContract, writeContract, waitForTransactionReceipt } from '@web3-onboard/wagmi';
import { ContractFunctionRevertedError, BaseError } from 'viem';
import { useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';
import _ from 'lodash';

// App Components
import { getWalletState, notify } from '@/utils/web3';
import useLocalStorage from '@/hooks/useLocalStorage';

// Transaction Handlers
import { handleTransactionResults } from '@/txs';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('[CONTEXT] Transactions');
log.debug('initialized');


const initialState = {
  txType: '',
  isPending: false,
  isSuccess: false,
  txHash: '',
  txReceipt: '',
  extraData: {},
};

export const TransactionContext = createContext(initialState);

export function useTransactionContext() {
  return useContext(TransactionContext);
}

const TransactionReducer = (state, action) => {
  switch (action.type) {
    case 'TX_START':
      return {
        ...state,
        txType: action.payload.txType,
        isPending: action.payload.isPending,
        isSuccess: false,
        txHash: action.payload.txHash,
        txReceipt: '',
        extraData: action.payload.extraData || {},
      };
    case 'TX_END':
      return {
        ...state,
        isPending: false,
        isSuccess: action.payload.isSuccess,
        txReceipt: action.payload.txReceipt,
      };
    case 'TX_CLEAR':
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export default function Provider({ children }) {
  const [ state, dispatch ] = useReducer(TransactionReducer, initialState);

  const sendTx = async ({ txType, txData, extraData = {} }) => {
    const txHash = await _sendTransaction(txData);
    dispatch({ type: 'TX_START', payload: {
      txType,
      txHash,
      isPending: true,
      extraData: { txData, ...extraData },
    } });
    return txHash;
  };

  const signMsg = async ({ txType, txData, extraData = {} }) => {
    const txHash = await _signMessage(txData.message);
    dispatch({ type: 'TX_START', payload: {
      txType,
      txHash,
      isPending: true,
      extraData: { txData, ...extraData },
    } });
    return txHash;
  };

  return (
    <TransactionContext.Provider value={[ state, dispatch, { sendTx, signMsg }]}>
      {children}
    </TransactionContext.Provider>
  );
}

export function Updater() {
  const [ state, dispatch ] = useTransactionContext();
  const [ lastTx, setLastTx ] = useLocalStorage('lastTx', null);
  const [{ connectedChain }] = useSetChain();
  const walletState = getWalletState();
  const lastHash = useRef('');

  // Watch LocalStorage for Transactions and Update State
  useEffect(() => {
    if (!_.isEmpty(lastTx) && _.isEmpty(lastHash.current)) {
      dispatch({ type: 'TX_START', payload: {
        txType: lastTx.txType,
        txHash: lastTx.txHash,
        isPending: true,
        extraData: lastTx.extraData,
      } });
    }
  }, [ lastTx, dispatch ]);

  // Watch State for Transactions and Handle Results
  useEffect(() => {
    (async () => {
      if (!_.isEmpty(walletState.wagmiConfig) && !_.isEmpty(state.txHash) && lastHash.current !== state.txHash) {
        lastHash.current = state.txHash;
        setLastTx(state);
        notify({ type: 'pending', message: 'Transaction submitted', autoDismiss: 3000 });

        const txReceipt = await waitForTransactionReceipt(walletState.wagmiConfig, {
          hash: state.txHash,
          onReplaced: (replacement) => {
            log.debug(`Transaction replaced: ${replacement}`);
            notify({ type: 'pending', message: 'Transaction replaced', autoDismiss: 3000 });
          },
        });

        const isSuccess = txReceipt.status === 'success';
        dispatch({ type: 'TX_END', payload: { isSuccess, txReceipt } });
        setLastTx(null);

        if (isSuccess) {
          let eventArgs;
          txReceipt.logs.forEach((evt) => {
            if (evt.address.toLowerCase() === state.extraData.txData.address.toLowerCase()) {
              const contractInterface = new ethers.Interface(state.extraData.txData.abi);
              eventArgs = contractInterface.parseLog(evt);
            }
          });

          // Transaction Handlers
          await handleTransactionResults(state, eventArgs);
        }
      }
    })();
  }, [
    state,
    dispatch,
    setLastTx,
    connectedChain?.id,
    walletState.wagmiConfig,
  ]);
}

async function _sendTransaction(txData) {
  try {
    const walletState = getWalletState();
    const { request } = await simulateContract(walletState.wagmiConfig, { ...txData });
    return await writeContract(walletState.wagmiConfig, request);
  } catch (err) {
    _handleErrors(err);
  }
}

async function _signMessage(msg) {
  try {
    const walletState = getWalletState();
    const [ activeWallet ] = walletState.wallets;
    return await signMessage(walletState.wagmiConfig, {
      message: msg,
      connector: activeWallet.wagmiConnector,
    });
  } catch (err) {
    _handleErrors(err);
  }
}

function _handleErrors(err) {
  console.log(err);
  if (err?.cause.code === 4001) {
    notify({ type: 'error', message: 'Transaction rejected by user', autoDismiss: 3000 });
  } else if (err instanceof BaseError) {
    const revertError = err.walk(err => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? '';
      notify({ type: 'error', message: 'Transaction failed: ' + errorName, autoDismiss: 3000 });
    }
  } else {
    notify({ type: 'error', message: 'Transaction failed', autoDismiss: 3000 });
  }
}
