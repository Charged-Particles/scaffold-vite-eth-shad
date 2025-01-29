// App Components
import ERC20MintableAbi from '@/abis/ERC20Mintable';
import { GLOBALS } from '@/utils/globals';

const chargedParticlesLogo = 'https://assets.coingecko.com/coins/images/15836/small/DrKjSQMH_400x400.png?1696515454';

export const web3contracts = {
  ERC20Mintable: {
    '1': {
      network: 'mainnet',
      address: '0x0F38f38CE09125F222125198c7f5D4E45Eeb088e',
      abi: ERC20MintableAbi,
    },
    '11155111': {
      network: 'sepolia',
      address: '0x3A08696bf7f21b19aE95e50ffA73f4ae5a27a610',
      abi: ERC20MintableAbi,
    },
    '34443': {
      network: 'mode',
      address: '0xD6Fcbb44A4483FE030D1B2c3133870c8185582a1',
      abi: ERC20MintableAbi,
    },
    '919': {
      network: 'modeSepolia',
      address: '0x6Cf8b7D14855A455C21AE46bb8C1060F28748D2d',
      abi: ERC20MintableAbi,
    },
    '8453': {
      network: 'base',
      address: '0x1E70aa1599a624880e91103738591C920cCbb925',
      abi: ERC20MintableAbi,
    },
    '84532': {
      network: 'baseSepolia',
      address: '0x6Cf8b7D14855A455C21AE46bb8C1060F28748D2d',
      abi: ERC20MintableAbi,
    },
  },
};

export const web3chains = [
  {
    id: '0x1', // 1
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${GLOBALS.ALCHEMY_ETH_APIKEY}`,
    secondaryTokens: [
      {
        address: web3contracts.ERC20Mintable['1'].address,
        icon: chargedParticlesLogo,
      },
    ],
  },
  // {
  //   id: '0xaa36a7', // 11155111
  //   token: 'ETH',
  //   label: 'Ethereum - Sepolia',
  //   rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${GLOBALS.ALCHEMY_ETH_APIKEY}`,
  //   secondaryTokens: [
  //     {
  //       address: web3contracts.ERC20Mintable['11155111'].address,
  //       icon: chargedParticlesLogo,
  //     },
  //   ],
  // },
  {
    id: '0x2105', // 8453
    token: 'ETH',
    label: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    secondaryTokens: [
      {
        address: web3contracts.ERC20Mintable['8453'].address,
        icon: chargedParticlesLogo,
      },
    ],
  },
  {
    id: '0x14a34', // 84532
    token: 'ETH',
    label: 'Base - Sepolia',
    rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${GLOBALS.ALCHEMY_ETH_APIKEY}`,
    secondaryTokens: [
      {
        address: web3contracts.ERC20Mintable['84532'].address,
        icon: chargedParticlesLogo,
      },
    ],
  },
  {
    id: '0x868b', // 34443
    token: 'ETH',
    label: 'Mode',
    rpcUrl: 'https://mainnet.mode.network',
    secondaryTokens: [
      {
        address: web3contracts.ERC20Mintable['34443'].address,
        icon: chargedParticlesLogo,
      },
    ],
  },
  {
    id: '0x397', // 919
    token: 'ETH',
    label: 'Mode - Sepolia',
    rpcUrl: 'https://sepolia.mode.network',
    secondaryTokens: [
      {
        address: web3contracts.ERC20Mintable['919'].address,
        icon: chargedParticlesLogo,
      },
    ],
  },
];
