// App Components
import { notify } from '@/utils/web3';
import { web3contracts } from '@/utils/web3config';

export const getMintTx = ({ account, amount, chainId }) => {
  return {
    txType: 'mint',
    txData: {
      address: web3contracts.ERC20Mintable[chainId].address,
      abi: web3contracts.ERC20Mintable[chainId].abi,
      functionName: 'mint',
      args: [ account, amount ],
    },
    extraData: {},
  };
};

// Note: called from "src/contexts/transactions.jsx" via "handleTransactionResults()" located in "src/txs/index.js"
export const handleMintTx = async ({ txState, eventArgs }) => {
  const [ from, to, amount ] = eventArgs;

  // TODO: Track TX Results in DB
  console.log('Mint Success!', { from, to, amount });

  // Update UI
  notify({ type: 'success', message: 'You Minted 1.0 E20M Token!', txHash: txState.txHash });
};
