// Transaction Handlers
import { getApproveTokenTx, handleApproveTokenTx } from './approveErc20';
import { getApproveNftTx, handleApproveNftTx } from './approveErc721';
import { getMintTx, handleMintTx } from './mintErc20';
import { getEthBalance } from './getEthBalance';
import { getTokenBalance } from './getTokenBalance';

export const handleTransactionResults = async (txState, eventArgs) => {
  if (txState.txType === 'approveErc20') {
    await handleApproveTokenTx({ txState, eventArgs });
  }
  if (txState.txType === 'approveErc721') {
    await handleApproveNftTx({ txState, eventArgs });
  }
  if (txState.txType === 'mint') {
    await handleMintTx({ txState, eventArgs });
  }
};

export {
  getEthBalance,
  getTokenBalance,
  getApproveTokenTx,
  getApproveNftTx,
  getMintTx,
};
