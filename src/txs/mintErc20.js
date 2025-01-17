// App Components
import web3Onboard, { notify } from '@/utils/web3';
import { GLOBALS } from '@/utils/globals';

export const getMintTx = ({ account, amount, chain }) => {
  return {
    txType: 'mint',
    txData: {
      address: GLOBALS.CONTRACTS.ERC20Mintable[chain.id].address,
      abi: GLOBALS.CONTRACTS.ERC20Mintable[chain.id].abi,
      functionName: 'mint',
      args: [ account, amount ],
    },
    extraData: {},
  };
};

// Note: called from "src/contexts/transactions.jsx"
export const handleMintTx = async (eventArgs) => {
  const [ from, to, amount ] = eventArgs.args;
  console.log('Mint Success!', { from, to, amount });

  // TODO: Track TX Results in DB

  // Update UI
  web3Onboard.state.actions.updateBalances();
  notify({ type: 'success', message: 'You Minted 1.0 E20M Token!', autoDismiss: 5000 });
};
