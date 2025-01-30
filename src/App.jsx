// Frameworks
import React, { useEffect } from 'react';
import { Router } from '@reach/router';

// React-Query
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import ReactQueryClient from '@/queries';

// UI Theme
import '@/layout/styles/tailwind.css';
import theme from '@/layout/styles/root.theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@/layout/styles/overrides.css';

// Rainbow Kit
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/utils/web3config';

// Toasify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Data Contexts
import TxContextProvider, { Updater as TxContextUpdater } from '@/contexts/transactions';

// Page Templates
import AppLayout from '@/layout/AppLayout';
import Home from '@/pages/Home';

// App Components
import { Helpers } from '@/utils/helpers';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('App');
log.debug('initialized');


function AppRoutes() {
  return (
    <Router basepath="/">
      <Home path="/" default />
    </Router>
  );
}

function AppContexts({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={ReactQueryClient.instance()}>
        <RainbowKitProvider theme={darkTheme()}>
          <TxContextProvider>
            {children}
          </TxContextProvider>
          <ToastContainer />
        </RainbowKitProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function AppUpdaters() {
  useEffect(() => {
    Helpers.hideInitialLoading();
  }, []);

  return (
    <>
      <TxContextUpdater />
    </>
  );
}

function App({ location }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContexts>
        <AppUpdaters />
        <AppLayout location={location}>
          <AppRoutes />
        </AppLayout>
      </AppContexts>
    </ThemeProvider>
  );
}

export default App;
