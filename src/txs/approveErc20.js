// App Components
import { notify } from '@/utils/web3';
import { web3contracts } from '@/utils/web3config';

export const getApproveTokenTx = ({ account, amount, chainId }) => {
  return {
    txType: 'approveErc20',
    txData: {
      address: web3contracts.ERC20Mintable[chainId].address,
      abi: web3contracts.ERC20Mintable[chainId].abi,
      functionName: 'approve',
      args: [ account, amount ],
    },
    extraData: {},
  };
};

// Note: called from "src/contexts/transactions.jsx" via "handleTransactionResults()" located in "src/txs/index.js"
export const handleApproveTokenTx = async ({ txState, eventArgs }) => {
  const [ success ] = eventArgs;

  // TODO: Track TX Results in DB
  console.log('Approve Success!', { success });

  // Update UI
  notify({ type: 'success', message: 'Tokens Approved!', txHash: txState.txHash });
};
