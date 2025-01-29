// App Components
import web3Onboard, { notify, getChainAsNumber } from '@/utils/web3';
import { web3contracts } from '@/utils/web3config';

export const getMintTx = ({ account, amount, chain }) => {
  const chainId = getChainAsNumber(chain.id);
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
export const handleMintTx = async ({ eventArgs }) => {
  const [ from, to, amount ] = eventArgs;
  console.log('Mint Success!', { from, to, amount });

  // TODO: Track TX Results in DB

  // Update UI
  web3Onboard.state.actions.updateBalances();
  notify({ type: 'success', message: 'You Minted 1.0 E20M Token!', autoDismiss: 5000 });
};
