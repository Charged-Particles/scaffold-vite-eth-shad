
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
GLOBALS.ALCHEMY_ETH_APIKEY = _ENV.VITE_ALCHEMY_ETH_APIKEY;
GLOBALS.WALLET_CONNECT_PROJECT_ID = _ENV.VITE_WALLET_CONNECT_PROJECT_ID;

export { GLOBALS };
