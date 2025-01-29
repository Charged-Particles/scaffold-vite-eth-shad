import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
// import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseModule from '@web3-onboard/coinbase';
// import ledgerModule from '@web3-onboard/ledger';
import wagmi from '@web3-onboard/wagmi';
import {
  switchChain as wagmiSwitchChain,
  disconnect as wagmiDisconnect,
} from '@web3-onboard/wagmi';
import { isHex, fromHex } from 'viem';

// App Components
import Logo from '../assets/logo.png';
import { web3chains } from './web3config';
import { GLOBALS } from '@/utils/globals';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('Web3-Onboard');
log.debug('initialized');


// Initialize wallet modules
const injected = injectedModule();
// const walletConnect = walletConnectModule({ projectId: `${GLOBALS.WALLET_CONNECT_PROJECT_ID}` });
const coinbase = coinbaseModule();
// const ledger = ledgerModule();

const web3Onboard = init({
  theme: 'dark',
  // apiKey: '',
  wagmi,
  wallets: [
    // metamask,
    injected,
    // walletConnect,
    coinbase,
    // ledger,
  ],
  chains: web3chains,
  appMetadata: {
    name: GLOBALS.SEO.title,
    description: GLOBALS.SEO.desc,
    icon: Logo,
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    ],
    // Optional - but allows for dapps to require users to agree to TOS and privacy policy before connecting a wallet
    // agreement: {
    //   version: '1.0.0',
    //   termsUrl: 'https://www.blocknative.com/terms-conditions',
    //   privacyUrl: 'https://www.blocknative.com/privacy-policy',
    // },
  },
  connect: {
    autoConnectLastWallet: true,
    showSidebar: true,
    disableClose: false,
  },
  accountCenter: {
    desktop: {
      enabled: true,
      position: 'topRight',
    },
    mobile: {
      enabled: true,
      position: 'topRight',
    },
  },
  notify: {
    desktop: {
      enabled: true,
    },
    mobile: {
      enabled: true,
    },
  },
});

export const getChainAsNumber = (chainId) => {
  let chainAsNumber;
  if (isHex(chainId)) {
    chainAsNumber = fromHex(chainId, 'number');
  } else if (!isHex(chainId) && typeof chainId === 'number') {
    chainAsNumber = chainId;
  } else {
    throw new Error('Invalid chainId');
  }
  return chainAsNumber;
};

export const connectWallet = async () => {
  const wallets = await web3Onboard.connectWallet();
  return wallets;
};

export const disconnectWallet = async () => {
  const wagmiConfig = web3Onboard.state.get().wagmiConfig;
  const [ activeWallet ] = web3Onboard.state.get().wallets;
  const { wagmiConnector } = activeWallet;
  wagmiDisconnect(wagmiConfig, { connector: wagmiConnector });
};

export const getWalletState = () => {
  return web3Onboard.state.get();
};

export const switchWagmiChain = async (chainId) => {
  const [ activeWallet ] = web3Onboard.state.get().wallets;
  const { wagmiConnector } = activeWallet;
  const chainAsNumber = getChainAsNumber(chainId);
  const wagmiConfig = web3Onboard.state.get().wagmiConfig;
  await wagmiSwitchChain(wagmiConfig, {
    chainId: chainAsNumber,
    connector: wagmiConnector,
  });
};

export const notify = ({ type, message, autoDismiss = 0 }) => {
  web3Onboard.state.actions.customNotification({
    type,
    message,
    autoDismiss,
  });
};

export default web3Onboard;
