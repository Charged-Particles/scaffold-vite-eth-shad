// Frameworks
import { readContracts } from '@wagmi/core';
import { formatUnits } from 'ethers';

// App Components
import { web3contracts, wagmiConfig } from '@/utils/web3config';

export const getTokenBalance = async ({
  account,
  chainId,
  tokenAddress = false,
  tokenAbi = false,
  includeSymbol = false,
}) => {
  if (!tokenAddress) { tokenAddress = web3contracts.ERC20Mintable[chainId].address; }
  if (!tokenAbi) { tokenAbi = web3contracts.ERC20Mintable[chainId].abi; }

  const calls = [
    {
      address: tokenAddress,
      abi: tokenAbi,
      functionName: 'balanceOf',
      args: [ account ]
    },
    {
      address: tokenAddress,
      abi: tokenAbi,
      functionName: 'decimals',
    },
  ];

  if (includeSymbol) {
    calls.push(
      {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'symbol',
      }
    );
  }

  const data = await readContracts(wagmiConfig, { contracts: calls });
  const tokenBalance = data[0]?.result || 0;
  const decimals = data[1]?.result || 18;
  let balance = formatUnits(tokenBalance, decimals);

  if (includeSymbol) {
    const symbol = data[2]?.result || '';
    balance = `${balance} ${symbol}`;
  }

  return balance;
};