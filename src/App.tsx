import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';


import Intro from './Intro';
import Presalecomponent from './Presalecomponent';


import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { base } from '@reown/appkit/networks';

import {
  createAppKit,
  useAppKitState,
  useAppKitProvider,
  useAppKitAccount,
} from '@reown/appkit/react';


// 1. Get projectId
const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set');
}

// 2. Set networks
const networks = [base];

const ethersAdapter = new EthersAdapter();

// 3. Create AppKit
createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId,
  features: {
    analytics: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': 'blue',
    '--w3m-accent': 'blue',
  },
  chainImages: {

      84532: '/images/baset.png',
    },
  metadata: {
    name: 'WSM20',
    description: '',
    url: '',
    icons: ['/logo.png']
  },
  enableCoinbase: false,

  featuredWalletIds: [
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150'
  ]
});

function App() {




  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
          <Route path="/presale" element={<Presalecomponent />} />

      </Routes>
    </Router>
  );
};

export default App;
