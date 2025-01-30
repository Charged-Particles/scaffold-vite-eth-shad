// App Components
import erc721ABI from '@/abis/IERC721';
import { notify } from '@/utils/web3';

export const getApproveNftTx = ({ tokenAddress, tokenId, account }) => {
  return {
    txType: 'approveErc721',
    txData: {
      address: tokenAddress,
      abi: erc721ABI,
      functionName: 'approve',
      args: [ account, tokenId ],
    },
    extraData: {},
  };
};

// Note: called from "src/contexts/transactions.jsx" via "handleTransactionResults()" located in "src/txs/index.js"
export const handleApproveNftTx = async ({ txState, eventArgs }) => {
  const [ success ] = eventArgs;

  // TODO: Track TX Results in DB
  console.log('Approve Success!', { success });

  // Update UI
  notify({ type: 'success', message: 'NFT Approved!', txHash: txState.txHash });
};
