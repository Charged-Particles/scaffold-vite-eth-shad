import ERC20MintableAbi from '../abis/ERC20Mintable';

const GLOBALS = {};
const _ENV = import.meta.env;

GLOBALS.COMPANY_NAME        = 'Carbon';
GLOBALS.CODENAME            = 'Carbon';
GLOBALS.CODENAME_ABBR       = 'C';
GLOBALS.CODE_VERSION        = 'v0.1.0';
GLOBALS.CONTACT_EMAIL       = 'info@carbonopus.com';

GLOBALS.SEO = {
  title           : GLOBALS.COMPANY_NAME,
  titleTemplate   : `%s · ${GLOBALS.COMPANY_NAME}`,
  desc            : 'Scaffold Dapp for Web3',
  author          : 'Rob Secord',
  twitterUsername : '@RobSecord',
  url             : _ENV.VITE_APP_BASE_URL,
  logoUrl         : 'src/images/favicon/android-chrome-192x192.png',
  image           : 'src/images/favicon/android-chrome-192x192.png',
};

GLOBALS.ENV = _ENV.VITE_ENV || 'development';
GLOBALS.IS_DEV = (GLOBALS.ENV === 'development');
GLOBALS.IS_STG = (GLOBALS.ENV === 'staging');
GLOBALS.IS_PRD = (GLOBALS.ENV === 'production');
GLOBALS.DEBUG_MODE = !GLOBALS.IS_PRD;

// API Keys
GLOBALS.INFURA_API_KEY = _ENV.VITE_INFURA_API_KEY;
GLOBALS.WALLET_CONNECT_PROJECT_ID = _ENV.VITE_WALLET_CONNECT_PROJECT_ID;
GLOBALS.ALCHEMY_SEPOLIA_APIKEY = _ENV.VITE_ALCHEMY_SEPOLIA_APIKEY;
GLOBALS.ALCHEMY_BASE_SEPOLIA_APIKEY = _ENV.VITE_ALCHEMY_BASE_SEPOLIA_APIKEY;

GLOBALS.CONTRACTS = {
  ERC20Mintable: {
    // '1': {
    //   network: 'mainnet',
    //   address: '',
    //   abi: ERC20MintableAbi,
    // },
    '0xaa36a7': {
      network: 'sepolia',
      address: '0x35dc842771bEA2c0858118d745C2F76AB8Ea15Ca',
      abi: ERC20MintableAbi,
    },
    '34443': {
      network: 'mode',
      address: '0x48387fb4Fb2DA51d6b15373CA24018c58E6ece50',
      abi: ERC20MintableAbi,
    },
    '0x14a34': {
      network: 'baseSepolia',
      address: '0x6Cf8b7D14855A455C21AE46bb8C1060F28748D2d',
      abi: ERC20MintableAbi,
    },
  },
};

export { GLOBALS };
