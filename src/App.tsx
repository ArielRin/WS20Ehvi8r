import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

import Intro from './Intro';
import Presalecomponent from './Presalecomponent';

Presalecomponent





import { ethers, BrowserProvider } from 'ethers';
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from '@web3modal/ethers/react';

const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set');
}

const chains = [

  {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org'
  },

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
  enableCoinbase: false,
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
  enableAnalytics: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': 'blue',
    '--w3m-accent': 'blue',
  },
  chainImages: {
      8453: '/images/base.png',

      84532: '/images/baset.png',
    },
  featuredWalletIds: [
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150'
  ]
});


  const App = () => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [connected, setConnected] = useState(false);

    const { open, close } = useWeb3Modal();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    useEffect(() => {
      const connectWalletOnPageLoad = async () => {
        if (localStorage.getItem("isWalletConnected") === "true") {
          await connectWallet();
        }
      };
      connectWalletOnPageLoad();
    }, []);

    const connectWallet = async () => {
      try {
        await open();
        if (walletProvider) {
          const provider = new BrowserProvider(walletProvider);
          setProvider(provider);
          setConnected(true);
          localStorage.setItem("isWalletConnected", "true");
        } else {
          console.error("walletProvider is undefined");
        }
      } catch (error) {
        console.error("Could not get a wallet connection", error);
      }
    };


    const disconnectWallet = async () => {
      await close();
      setProvider(null);
      setConnected(false);
      localStorage.removeItem("isWalletConnected");
    };


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
