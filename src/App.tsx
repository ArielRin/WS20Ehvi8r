// App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

import Intro from './Intro';
import PresaleComponent from './PresaleComponent';

import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { base, baseSepolia } from '@reown/appkit/networks';

// 1. Get projectId
const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set');
}

// 2. Set the networks
const networks = [base, baseSepolia];

// 3. Create a metadata object (optional)
const metadata = {
  name: 'WSM20',
  description: 'WSM20 Token Presale',
  url: '', // Your website URL
  icons: ['/logo.png'],
};

  // added testnets for dev recreation of joeys frontend works
    { chainId: 84532, name: 'Base Sepolia', currency: 'ETH', explorerUrl: 'https://sepolia.basescan.org', rpcUrl: 'https://sepolia.base.org' }

];

const ethersConfig = defaultConfig({
  metadata: {
    name: 'WSM20',
    description: '',
    url: '',
    icons: ['/logo.png']
  },
  defaultChainId: 84532,
  rpcUrl: 'https://sepolia.basescan.org',
  auth: {
    email: false,
    showWallets: true,
    walletFeatures: true
  }
});

const modal = createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': 'grey',
    '--w3m-accent': '#313131',
  },
  chainImages: {
    84532: '/images/baset.png',
  },
  enableCoinbase: false,
  featuredWalletIds: [
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  ],
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/presale" element={<PresaleComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
