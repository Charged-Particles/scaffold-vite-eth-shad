// Frameworks
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useAccount, useEnsName, useChainId, useChains } from 'wagmi';
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
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

// Aceternity UI
import { Button } from '@/components/ui/button';
import { EvervaultCard } from '@/components/ui/evervault-card';

// App Components
import SEO from '@/components/seo';
import { getMintTx, getEthBalance, getTokenBalance } from '@/txs';
import { useTransactionContext } from '@/contexts/transactions';
import { switchWagmiChain, disconnectWallet } from '@/utils/web3';

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
  boxShadow: '0 0 20px rgba(0, 128, 255, 0.5)', // Blue glow
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(255,255,255,0.05)',
    '&:focus': {
      borderColor: 'rgba(255, 165, 0, 0.5)', // Orange highlight on focus
      boxShadow: '0 0 5px rgba(255, 165, 0, 0.5)', // Orange glow
    },
  },
}));

const AddressChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(5px)',
  color: theme.palette.text.primary,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, rgba(0, 128, 255, 1) 0%, rgba(255, 165, 0, 1) 100%)',
  color: 'white',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  boxShadow: '0 0 10px rgba(0, 128, 255, 0.5)', // Blue glow
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 0 20px rgba(0, 128, 255, 0.7)', // Stronger blue glow on hover
    transform: 'scale(1.05)',
  },
}));

const Home = () => {
  const chainId = useChainId();
  const chains = useChains();
  const { address, isConnected } = useAccount();
  const { data: ensName, isSuccess } = useEnsName({ address, chainId });
  const [ ethBalance, setEthBalance ] = useState('');
  const [ tokenBalance, setTokenBalance ] = useState('');
  const [ , , { sendTx }] = useTransactionContext();
  const lastChainId = useRef();

  const handleChainChange = async (event) => {
    await switchWagmiChain(event.target.value);
  };

  const getAddressOrEns = useMemo(() => {
    return isSuccess && !!ensName ? ensName : address;
  }, [ address, ensName, isSuccess ]);

  useEffect(() => {
    if (address && chainId !== lastChainId.current) {
      load();
    }
    async function load() {
      const ethBalance = await getEthBalance({ account: address, chainId, includeSymbol: true });
      const tokenBalance = await getTokenBalance({ account: address, chainId, includeSymbol: true });
      if (chainId === lastChainId.current) { return }
      setEthBalance(ethBalance);
      setTokenBalance(tokenBalance);
      lastChainId.current = chainId;
    }
  }, [ address, chainId, lastChainId.current, isConnected ]);

  const sendTestTransaction = async () => {
    const transaction = getMintTx({
      account: address,
      amount: '1000000000000000000',
      chainId,
    });
    await sendTx(transaction);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <main style={{ width: '100%', minHeight: '100vh' }}>
      <SEO title={'Home'} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
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
              {!isConnected ? (
                <Stack spacing={2} alignItems="center">
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    Connect Your Wallet
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5">Wallet Connected</Typography>
                    <Box>
                      <AddressChip
                        avatar={<AccountBalanceWalletIcon />}
                        label={getAddressOrEns}
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
                      {ethBalance}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {tokenBalance}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Network
                    </Typography>
                    <StyledSelect
                      value={chainId || ''}
                      onChange={handleChainChange}
                      fullWidth
                    >
                      {chains.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <GradientButton
                      variant="secondary"
                      onClick={() => sendTestTransaction()}
                      startIcon={<LocalAtmIcon />}
                    >
                      Mint E20M Tokens
                    </GradientButton>
                  </Box>
                </Stack>
              )}
            </GradientPaper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default Home;
