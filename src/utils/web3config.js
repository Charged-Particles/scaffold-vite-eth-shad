// Frameworks
import { http } from '@wagmi/core';
import { mainnet, sepolia, mode, modeTestnet, base, baseSepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// App Components
import ERC20MintableAbi from '@/abis/ERC20Mintable';
import { GLOBALS } from '@/utils/globals';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('Web3 Config');
log.debug('initialized');

// const chargedParticlesLogo = 'https://assets.coingecko.com/coins/images/15836/small/DrKjSQMH_400x400.png?1696515454';
const ethLogo = 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628';
const modeLogo = 'https://github.com/mode-network/brandkit/blob/main/Assets/Logo/Token.png?raw=true';
const baseLogo = 'https://assets.coingecko.com/coins/images/31199/standard/59302ba8-022e-45a4-8d00-e29fe2ee768c-removebg-preview.png?1696530026';

export const wagmiConfig = getDefaultConfig({
  appName: 'Web3 Packs',
  projectId: GLOBALS.WALLET_CONNECT_PROJECT_ID,
  chains: [
    { ...mainnet, iconUrl: ethLogo, iconBackground: '#000' },
    { ...sepolia, iconUrl: ethLogo, iconBackground: '#000' },
    { ...mode, iconUrl: modeLogo, iconBackground: '#000' },
    { ...modeTestnet, iconUrl: modeLogo, iconBackground: '#000' },
    { ...base, iconUrl: baseLogo, iconBackground: '#000' },
    { ...baseSepolia, iconUrl: baseLogo, iconBackground: '#000' },
  ],
  transports: {
    [mainnet.id]      : http(`https://eth-mainnet.g.alchemy.com/v2/${GLOBALS.ALCHEMY_ETH_APIKEY}`),
    [sepolia.id]      : http(`https://eth-sepolia.g.alchemy.com/v2/${GLOBALS.ALCHEMY_ETH_APIKEY}`),
    [mode.id]         : http(),
    [modeTestnet.id]  : http(),
    [base.id]         : http(`https://base-mainnet.g.alchemy.com/v2/${GLOBALS.ALCHEMY_ETH_APIKEY}`),
    [baseSepolia.id]  : http(`https://base-sepolia.g.alchemy.com/v2/${GLOBALS.ALCHEMY_ETH_APIKEY}`),
  },
});

export const web3contracts = {
  ERC20Mintable: {
    [`${mainnet.id}`]: {
      network: 'mainnet',
      address: '0x0F38f38CE09125F222125198c7f5D4E45Eeb088e',
      abi: ERC20MintableAbi,
    },
    [`${sepolia.id}`]: {
      network: 'sepolia',
      address: '0x3A08696bf7f21b19aE95e50ffA73f4ae5a27a610',
      abi: ERC20MintableAbi,
    },
    [`${mode.id}`]: {
      network: 'mode',
      address: '0xD6Fcbb44A4483FE030D1B2c3133870c8185582a1',
      abi: ERC20MintableAbi,
    },
    [`${modeTestnet.id}`]: {
      network: 'modeSepolia',
      address: '0x6Cf8b7D14855A455C21AE46bb8C1060F28748D2d',
      abi: ERC20MintableAbi,
    },
    [`${base.id}`]: {
      network: 'base',
      address: '0x1E70aa1599a624880e91103738591C920cCbb925',
      abi: ERC20MintableAbi,
    },
    [`${baseSepolia.id}`]: {
      network: 'baseSepolia',
      address: '0x6Cf8b7D14855A455C21AE46bb8C1060F28748D2d',
      abi: ERC20MintableAbi,
    },
  },
};
