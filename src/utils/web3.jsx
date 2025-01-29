// Frameworks
import React from 'react';
import { getAccount, switchChain, disconnect } from '@wagmi/core';
import { toast } from 'react-toastify';
import { isHex, fromHex } from 'viem';
import _ from 'lodash';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// App Components
import { wagmiConfig } from '@/utils/web3config';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('Web3');
log.debug('initialized');

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

export const disconnectWallet = async () => {
  disconnect(wagmiConfig);
};

export const switchWagmiChain = async (chainId) => {
  const chainAsNumber = getChainAsNumber(chainId);
  await switchChain(wagmiConfig, { chainId: chainAsNumber });
};

export const notify = ({ message, txHash = '' }) => {
  const { chain } = getAccount(wagmiConfig);
  const blockExplorer = _.get(chain, 'blockExplorers.default.url', '');
  toast.success(
    <Box>
      <Typography>{message}</Typography>
      {txHash.length > 0 && (
        <a href={`${blockExplorer}/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
          View on Block Explorer
          <OpenInNewIcon fontSize="small" sx={{ marginLeft: 1 }}/>
        </a>
      )}
    </Box>
  );
};

// export default wagmiConfig;
