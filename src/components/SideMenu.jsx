// Frameworks
import React from 'react';
import { motion } from 'framer-motion';

// Material UI
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';

// App Components
import { useSidebar, SidebarLink } from './ui/sidebar';
import { TextHoverEffect } from './ui/text-hover-effect';
// import { ReactComponent as CarbonLogo } from '../assets/logo/carbonopus_logo_white.svg';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('SideMenu');
log.debug('initialized');

const links = [
  {
    label: 'Home',
    href: '#',
    icon: (
      <HomeIcon color="secondary" fontSize="small" />
    ),
  },
];

export const LogoText = () => {
  return (
    <Stack direction="row" sx={{ width: 300 }}>
      <div className="h-8 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre pt-1"
      >
        <TextHoverEffect text="Carbon" />
      </motion.span>
    </Stack>
  );
};

export const LogoIcon = () => {
  return (
    <Stack direction="row" sx={{ width: 300 }}>
      <div className="h-8 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Stack>
  );
};

export const SideMenu = () => {
  const { open } = useSidebar();
  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      {open ? <LogoText /> : <LogoIcon />}
      <div className="mt-8 flex flex-col gap-2">
        {links.map((link, idx) => (
          <SidebarLink key={idx} link={link} className="no-underline" />
        ))}
      </div>
    </div>
  );
};
