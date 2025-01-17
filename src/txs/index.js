// Transaction Handlers
import { handleMintTx } from './mintErc20';

export const handleTransactionResults = async (txState, eventArgs) => {
  if (txState.txType === 'mint') {
    await handleMintTx(eventArgs);
  }
};
