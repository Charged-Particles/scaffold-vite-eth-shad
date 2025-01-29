// Frameworks
import React, { createContext, useContext, useReducer, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useAccountEffect, useChainId } from 'wagmi';
import { signMessage, simulateContract, writeContract, waitForTransactionReceipt, getTransactionReceipt } from '@wagmi/core';
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
        txChainId: action.payload.txChainId,
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
  const chainId = useChainId();
  const txChainId = getChainAsNumber(chainId || 0);

  const sendTx = async ({ txType, txData, extraData = {} }) => {
    const txHash = await _sendTransaction(txData);
    dispatch({ type: 'TX_START', payload: {
      txChainId,
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
  const [ isReady, setIsReady ] = useState(false);
  const chainId = useChainId();
  const currentChainId = getChainAsNumber(chainId || 0);
  const lastAccount = useRef('');
  const lastHash = useRef('');

  // Wait for Wallet Connection
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
    // onDisconnect() {
    //   console.log('Disconnected!')
    // },
  });

  // Watch LocalStorage for Transactions and Update State
  useEffect(() => {
    if (!_.isEmpty(lastTx) && _.isEmpty(lastHash.current) && isReady) {
      dispatch({ type: 'TX_START', payload: {
        txChainId: lastTx.txChainId ?? 1,
        txType: lastTx.txType,
        txHash: lastTx.txHash,
        isPending: true,
        extraData: lastTx.extraData,
      } });
    }
  }, [ lastTx, dispatch, isReady ]);

  // Watch State for Transactions and Handle Results
  useEffect(() => {
    (async () => {
      const _handleTxReceipt = async ({ txReceipt }) => {
        const isSuccess = txReceipt.status === 'success';
        dispatch({ type: 'TX_END', payload: { isSuccess, txReceipt } });
        setLastTx(null);

        if (isSuccess) {
          // Parse Event Logs from TX
          let eventArgs;
          txReceipt.logs.forEach((evt) => {
            if (evt.address.toLowerCase() === state.extraData.txData.address.toLowerCase()) {
              const contractInterface = new ethers.Interface(state.extraData.txData.abi);
              eventArgs = contractInterface.parseLog(evt);
            }
          });

          // Transaction Handlers
          await handleTransactionResults(state, eventArgs.args);
        }
      };
      try {
        if (!_.isEmpty(state.txHash) && lastHash.current !== state.txHash && state.txChainId === currentChainId) {
          lastHash.current = state.txHash;
          setLastTx(state);
          notify({ type: 'pending', message: 'Transaction submitted' });

          getTransactionReceipt(wagmiConfig, { hash: state.txHash })
            .then((txReceipt) => {
              return _handleTxReceipt({ txReceipt });
            })
            .catch((err) => {
              return waitForTransactionReceipt(wagmiConfig, {
                hash: state.txHash,
                onReplaced: (replacement) => {
                  log.debug('Transaction replaced: ', replacement);
                  notify({ type: 'pending', message: 'Transaction replaced' });
                },
              })
              .then((txReceipt) => {
                return _handleTxReceipt({ txReceipt });
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
    setLastTx,
  ]);

  return () => {
    unsubscribe();
  };
}

async function _sendTransaction(txData) {
  try {
    const { request } = await simulateContract(wagmiConfig, { ...txData });
    return await writeContract(wagmiConfig, request);
  } catch (err) {
    _handleErrors(err);
  }
}

async function _signMessage(msg) {
  try {
    return await signMessage(wagmiConfig, { message: msg });
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
