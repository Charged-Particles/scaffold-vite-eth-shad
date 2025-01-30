// Frameworks
import React, { createContext, useContext, useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { useAccountEffect, useAccount, useChainId } from 'wagmi';
import { signMessage, simulateContract, writeContract, waitForTransactionReceipt, getTransactionReceipt, getAccount, getChainId } from '@wagmi/core';
import { ContractFunctionRevertedError, BaseError } from 'viem';
import { ethers } from 'ethers';
import _ from 'lodash';

// App Components
import { getChainAsNumber, notify } from '@/utils/web3';
import { wagmiConfig } from '@/utils/web3config';
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
  txChainId: 0,
  txSenderAddress: '',
  txHash: '',
  txReceipt: '',
  extraData: {},
};
const lastTxByAddress = {};

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
        txChainId: action.payload.txChainId,
        txSenderAddress: action.payload.txSenderAddress,
        txHash: action.payload.txHash,
        txReceipt: '',
        extraData: action.payload.extraData || {},
      };
    case 'TX_END':
      return {
        ...state,
        ...initialState,
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
  const { address: txSenderAddress } = getAccount(wagmiConfig);
  const chainId = useChainId();
  const txChainId = getChainAsNumber(chainId || 0);

  const sendTx = async ({ txType, txData, extraData = {} }) => {
    const txHash = await _sendTransaction(txData);
    dispatch({ type: 'TX_START', payload: {
      txChainId,
      txSenderAddress,
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
      txChainId,
      txSenderAddress,
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
  const { address: currentAddress } = useAccount();
  const chainId = useChainId();
  const currentChainId = getChainAsNumber(chainId || 0);
  const [ state, dispatch ] = useTransactionContext();
  const [ lastTx, setLastTx ] = useLocalStorage(`lastTx-${currentAddress}-${currentChainId}`, null);
  const [ isReady, setIsReady ] = useState(false);
  const lastAccount = useRef('');
  const lastChainId = useRef('');
  const lastHash = useRef('');

  const _trackLastTx = (address, chainId, state) => {
    setLastTx(state);
    lastTxByAddress[`lastTx-${address}-${chainId}`] = state;
  };


  // Wait for Wallet Connection/Disconnection
  useAccountEffect({
    config: wagmiConfig,
    onConnect(data) {
      if (_.isEmpty(data)) { return; }
      const account = data.address;
      if (lastAccount.current !== account) {
        lastAccount.current = account;
        setIsReady(true);
      }
    },
    onDisconnect() {
      lastAccount.current = '';
      lastHash.current = '';
      setIsReady(false);
      dispatch({ type: 'TX_CLEAR' });
    },
  });

  // Watch for Wallet/Chain Change
  useEffect(() => {
    if (currentAddress && currentChainId) {
      if (lastAccount.current !== currentAddress || lastChainId.current != currentChainId) {
        lastAccount.current = currentAddress;
        lastChainId.current = currentChainId;
        lastHash.current = '';
        dispatch({ type: 'TX_CLEAR' });

        const accountLastTx = lastTxByAddress[`lastTx-${currentAddress}-${currentChainId}`];
        if (accountLastTx) {
          dispatch({ type: 'TX_START', payload: { ...accountLastTx, isPending: true }});
        }
        setIsReady(true);
      }
    }
  }, [ currentAddress, currentChainId ]);


  // Watch LocalStorage for Transactions and Update State
  useEffect(() => {
    if (!_.isEmpty(lastTx) && _.isEmpty(lastHash.current) && isReady) {
      dispatch({ type: 'TX_START', payload: { ...lastTx, isPending: true }});
    }
  }, [ lastTx, lastHash.current, dispatch, isReady ]);


  // Handle Transaction Receipt after Confirmation
  const _handleTxReceipt = useCallback(({ txState, txReceipt }) => {
    // Ensure Correct User and Chain
    const { address: immediateAddress } = getAccount(wagmiConfig);
    const immediateChainId = getChainId(wagmiConfig);
    const isCorrectAccount = immediateAddress === txState.txSenderAddress;
    const isCorrectChain = immediateChainId === txState.txChainId;
    if (!isReady || !isCorrectAccount || !isCorrectChain) { return; }

    (async () => {
      // Dispatch End-of-Tx
      const isSuccess = txReceipt.status === 'success';
      dispatch({ type: 'TX_END', payload: { isSuccess, txReceipt } });
      _trackLastTx(immediateAddress, immediateChainId, null);

      if (isSuccess) {
        // Parse Event Logs from TX
        let eventArgs;
        txReceipt.logs.forEach((evt) => {
          if (evt.address.toLowerCase() === txState.extraData.txData.address.toLowerCase()) {
            const contractInterface = new ethers.Interface(txState.extraData.txData.abi);
            eventArgs = contractInterface.parseLog(evt);
          }
        });

        // Transaction Handlers
        await handleTransactionResults(txState, eventArgs.args);
      }
    })();
  }, [ isReady ]);


  // Watch State for Existing Transactions
  useEffect(() => {
    const isCorrectAccount = currentAddress === state.txSenderAddress;
    const isCorrectChain = currentChainId === state.txChainId;

    (async () => {
      try {
        if (!_.isEmpty(state.txHash) && lastHash.current !== state.txHash && isReady && isCorrectAccount && isCorrectChain) {
          lastHash.current = state.txHash;
          _trackLastTx(currentAddress, currentChainId, state);

          getTransactionReceipt(wagmiConfig, { hash: state.txHash })
            .then((txReceipt) => {
              _handleTxReceipt({ txState: state, txReceipt });
            })
            .catch((err) => {
              return waitForTransactionReceipt(wagmiConfig, {
                hash: state.txHash,
                onReplaced: (replacement) => {
                  log.debug('Transaction replaced: ', replacement);
                  notify({ type: 'pending', message: 'Transaction replaced, watching new transaction..' });
                },
              })
              .then((txReceipt) => {
                _handleTxReceipt({ txState: state, txReceipt });
              });
            })
            .catch((err) => {
              _handleErrors(err);
            });
        }
      } catch (err) {
        _handleErrors(err);
      }
    })();
  }, [
    state,
    dispatch,
    isReady,
    currentChainId,
    currentAddress,
  ]);

  return () => {
    unsubscribe();
  };
}

async function _sendTransaction(txData) {
  try {
    const { request } = await simulateContract(wagmiConfig, { ...txData });
    const result = await writeContract(wagmiConfig, request);
    notify({ type: 'pending', message: 'Transaction submitted' });
    return result;
  } catch (err) {
    _handleErrors(err);
  }
}

async function _signMessage(msg) {
  try {
    const result = await signMessage(wagmiConfig, { message: msg });
    notify({ type: 'pending', message: 'Signature submitted' });
    return result;
  } catch (err) {
    _handleErrors(err);
  }
}

function _handleErrors(err) {
  console.log(err);
  if (err?.cause?.code === 4001) {
    notify({ type: 'error', message: 'Transaction rejected by user' });
  } else if (err instanceof BaseError) {
    const revertError = err.walk(err => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? '';
      notify({ type: 'error', message: 'Transaction failed: ' + errorName });
    }
  } else {
    notify({ type: 'error', message: 'Transaction failed' });
  }
}
