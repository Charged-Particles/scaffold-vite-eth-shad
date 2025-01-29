// Frameworks
import { getBalance } from '@wagmi/core';
import { formatUnits } from 'ethers';

// App Components
import { web3contracts, wagmiConfig } from '@/utils/web3config';

export const getEthBalance = async ({
  account,
  chainId,
  includeSymbol = false,
}) => {
  const data = await getBalance(wagmiConfig, { address: account, chainId });
  let balance = formatUnits(data.value, data.decimals);
  if (includeSymbol) {
    balance = `${balance} ${data.symbol}`;
  }
  return balance;
};