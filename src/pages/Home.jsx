// Frameworks
import React from 'react';
import { useEffect } from 'react';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import _ from 'lodash';

// Material UI
import {
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  Paper,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

// Aceternity UI
import { Button } from '@/components/ui/button';
import { EvervaultCard } from '@/components/ui/evervault-card';

// App Components
import SEO from '@/components/seo';
import { getMintTx } from '@/txs';
import { useTransactionContext } from '@/contexts/transactions';
import { connectWallet, disconnectWallet } from '@/utils/web3';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('[Route] Home');
log.debug('initialized');

// Styled Components
const GradientPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 100%, rgba(255,255,255,0.05) 0%)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: '1px solid rgba(255,255,255,0.1)',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
}));

const AddressChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(5px)',
  color: theme.palette.text.primary,
}));

const Home = () => {
  const [{ wallet, connecting }] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain ] = useSetChain();
  const [ , , { sendTx }] = useTransactionContext();

  const handleChainChange = async (event) => {
    await setChain({ chainId: event.target.value });
  };

  const getAddressOrEns = () => {
    return wallet.accounts[0].ens || wallet.accounts[0].uns || wallet.accounts[0].address;
  };

  const sendTestTransaction = async () => {
    const transaction = getMintTx({
      account: wallet.accounts[0].address,
      amount: '1000000000000000000',
      chain: connectedChain,
    });
    await sendTx(transaction);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <main style={{ width: '100%', minHeight: '100vh' }}>
      <SEO title={'Home'} />

      <Grid container spacing={6}>
        {/* Hero Section with Evervault Card */}
        <Grid item xs={12}>
          <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <EvervaultCard
              text="Carbon"
              className="transition duration-300"
              charCount={4000}
            />
          </Box>
        </Grid>

        {/* Wallet Section */}
        <Grid item xs={12}>
          <GradientPaper elevation={0}>
            {!wallet ? (
              <Stack spacing={2} alignItems="center">
                <AccountBalanceWalletIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h5" gutterBottom>
                  Connect Your Wallet
                </Typography>
                <Button
                  onClick={() => connectWallet()}
                  disabled={connecting}
                  size="lg"
                >
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5">Wallet Connected</Typography>
                  <Box>
                    <AddressChip
                      avatar={<><AccountBalanceWalletIcon /></>}
                      label={getAddressOrEns()}
                      sx={{ width: 'auto', mr: 2, px: 2 }}
                    />
                    <Button
                      variant="destructive"
                      onClick={() => disconnectWallet()}
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ opacity: 0.7 }} />

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Balance
                  </Typography>
                  <Typography variant="h6">
                    {_.get(wallet.accounts[0], 'balance.ETH', '0.00')} ETH
                  </Typography>
                  {
                    wallet?.accounts[0].secondaryTokens?.length > 0 && _.map(wallet.accounts[0].secondaryTokens, token => (
                      <Typography variant="subtitle1" gutterBottom>
                        {token.balance} {token.name}
                      </Typography>
                    ))
                  }
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Network
                  </Typography>
                  <StyledSelect
                    value={connectedChain?.id || ''}
                    onChange={handleChainChange}
                    disabled={settingChain}
                    fullWidth
                  >
                    {chains.map(({ id, label }) => (
                      <MenuItem key={id} value={id}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="secondary"
                    onClick={() => sendTestTransaction()}
                    startIcon={<LocalAtmIcon />}
                  >
                    Mint E20M Tokens
                  </Button>
                </Box>
              </Stack>
            )}
          </GradientPaper>
        </Grid>
      </Grid>
    </main>
  );
};

export default Home;
