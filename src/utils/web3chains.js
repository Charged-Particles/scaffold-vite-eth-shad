// App Components
import { GLOBALS } from '@/utils/globals';

export const web3chains = [
  // {
  //   id: '0x1', // 1
  //   token: 'ETH',
  //   label: 'Ethereum Mainnet',
  //   rpcUrl: `https://mainnet.infura.io/v3/${GLOBALS.INFURA_API_KEY}`,
  //   secondaryTokens: [
  //     { // USDC
  //       address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  //       icon: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694',
  //     },
  //     { // IONX
  //       address: '0x02d3a27ac3f55d5d91fb0f52759842696a864217',
  //       icon: 'https://assets.coingecko.com/coins/images/15836/standard/DrKjSQMH_400x400.png?1696515454',
  //     },
  //   ],
  // },
  // {
  //   id: '0xaa36a7', // 11155111
  //   token: 'ETH',
  //   label: 'Ethereum - Sepolia',
  //   rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${GLOBALS.ALCHEMY_SEPOLIA_APIKEY}`,
  // },
  // {
  //   id: '0x89',
  //   token: 'MATIC',
  //   label: 'Polygon',
  //   rpcUrl: 'https://polygon-rpc.com',
  // },
  // {
  //   id: '0x13881',
  //   token: 'MATIC',
  //   label: 'Polygon - Mumbai',
  //   rpcUrl: 'https://polygon-mumbai-bor-rpc.publicnode.com',
  // },
  // {
  //   id: '0xa',
  //   token: 'ETH',
  //   label: 'Optimism',
  //   rpcUrl: 'https://mainnet.optimism.io',
  // },
  // {
  //   id: '0x2105',
  //   token: 'ETH',
  //   label: 'Base',
  //   rpcUrl: 'https://mainnet.base.org',
  // },
  {
    id: '0x14a34',
    token: 'ETH',
    label: 'Base - Sepolia',
    rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${GLOBALS.ALCHEMY_BASE_SEPOLIA_APIKEY}`,
    secondaryTokens: [
      {
        address: '0x6Cf8b7D14855A455C21AE46bb8C1060F28748D2d',
        icon: 'https://assets.coingecko.com/coins/images/15836/standard/DrKjSQMH_400x400.png?1696515454',
      },
    ],
  },
  // {
  //   id: 10,
  //   token: 'OETH',
  //   label: 'Optimism',
  //   rpcUrl: 'https://mainnet.optimism.io',
  // },
  // {
  //   id: '0x38',
  //   token: 'BNB',
  //   label: 'Binance',
  //   rpcUrl: 'https://bsc-dataseed.binance.org/',
  //   secondaryTokens: [
  //     {
  //       address: '0x4d61577d8fd2208a0afb814ea089fdeae19ed202',
  //       icon: 'https://assets.coingecko.com/coins/images/15363/small/vfox2.png?1629870083',
  //     },
  //     {
  //       address: '0xde2f075f6f14eb9d96755b24e416a53e736ca363',
  //       icon: 'https://assets.coingecko.com/coins/images/13423/small/frax_share.png?1608478989',
  //     },
  //   ],
  // },
];
