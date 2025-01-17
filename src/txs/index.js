// Transaction Handlers
import { getMintTx, handleMintTx } from './mintErc20';

export const handleTransactionResults = async (txState, eventArgs) => {
  if (txState.txType === 'mint') {
    await handleMintTx({ txState, eventArgs });
  }
};

export {
  getMintTx,
};
