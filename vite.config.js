// import fs from 'fs/promises';
import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import webfontDownload from 'vite-plugin-webfont-dl';
import svgr from 'vite-plugin-svgr';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const MODE = process.env.NODE_ENV;
const development = MODE === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [ '@emotion/babel-plugin' ],
      },
    }),
    webfontDownload([
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      // 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
    ]),
    svgr(),
    development && nodePolyfills({
      include: [ 'node_modules/**/*.js', new RegExp('node_modules/.vite/.*js'), 'http', 'crypto' ],
    }),
  ],
  // esbuild: {
  //   jsxInject: `import _ from 'lodash'`, // eslint-disable-line
  // },
  build: {
    sourcemap: false,
    outDir: './dist',
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [ '@web3-onboard/*' ],
      plugins: [
        nodePolyfills({ include: [ 'crypto', 'http' ] }),
        // inject({ Buffer: ['Buffer', 'Buffer'] }),
      ],
      output: {
        manualChunks: {
          fb_app: [ 'firebase/app', 'firebase/auth', 'firebase/functions' ],
          fb_extra: [ 'firebase/analytics', 'firebase/storage' ],
          react: [ 'react', 'react-dom', '@reach/router', 'react-helmet' ],
          algolia: [ '@algolia/autocomplete-js', '@algolia/autocomplete-plugin-recent-searches', '@algolia/autocomplete-preset-algolia', '@algolia/autocomplete-theme-classic', 'algoliasearch' ],
          lodash: [ 'lodash' ],
          mui: [ '@emotion/react', '@emotion/styled', '@mui/icons-material', '@mui/lab', '@mui/material', '@mui/styled-engine-sc', '@mui/styles' ],
          aceternity: [ '@radix-ui/react-label', '@react-three/fiber', '@tabler/icons-react', '@tsparticles/engine', '@tsparticles/react', '@tsparticles/slim', '@types/three', 'three' ],
          tailwind: [ 'tailwind-merge', 'tailwindcss', 'tailwindcss-animate' ],
          ethereum: [ 'eth-provider', 'ethereum-multicall', 'ethers', 'ethval' ],
          web3_utils: [ 'nft.storage' ],
          web3_modal: [ 'web3modal' ],
          coinbase: [ '@coinbase/wallet-sdk' ],
          walletconnect: [ '@walletconnect/web3-provider' ],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: [ '@ethersproject/hash', 'wrtc', 'http' ],
    include: [
      '@web3-onboard/core',
      // '@web3-onboard/gas',
      // '@web3-onboard/sequence',
      'js-sha3',
      '@ethersproject/bignumber',
      // '@safe-global/safe-apps-sdk',
      // '@safe-global/safe-apps-provider',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  resolve: {
    alias: [
      {
        find: /@\/.+/,
        replacement: val => val.replace(/^@/, path.resolve(__dirname, './src/')),
      },
      {
        find: /^@mui\/icons-material\/(.*)/,
        replacement: '@mui/icons-material/esm/$1',
      },
      {
        find: 'crypto-browserify',
        replacement: 'crypto',
      },
      {
        find: 'stream-browserify',
        replacement: 'stream',
      },
      {
        find: 'assert',
        replacement: 'assert',
      },
      {
        find: 'browserify-zlib',
        replacement: 'zlib',
      },
    ],
  },
  server: {
    port: 8000,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  define: {
    global: 'window',
  },
});
