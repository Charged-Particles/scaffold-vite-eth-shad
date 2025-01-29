// Frameworks
import React, { useEffect } from 'react';
import { Router } from '@reach/router';

// React-Query
import { QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import ReactQueryClient from '@/queries';

// UI Theme
import '@/layout/styles/tailwind.css';
import theme from '@/layout/styles/root.theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@/layout/styles/overrides.css';

// Blocknative Web3 Onboard
import { Web3OnboardProvider } from '@web3-onboard/react';
import web3Onboard from '@/utils/web3';

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
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <QueryClientProvider client={ReactQueryClient.instance()}>
        <TxContextProvider>
          {children}
        </TxContextProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Web3OnboardProvider>
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
