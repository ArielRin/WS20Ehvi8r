import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';


import Intro from './Intro';
import Presalecomponent from './Presalecomponent';


import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { base, baseSepolia } from '@reown/appkit/networks';
// oi Ehvi8r change or add chains see this https://github.com/wevm/viem/tree/main/src/chains/definitions

import {
  createAppKit,
  useAppKitState,
  useAppKitProvider,
  useAppKitAccount,
  useAppKit
} from '@reown/appkit/react';



const ethersAdapter = new EthersAdapter();

const networks = [base, baseSepolia];

const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set');
}


createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId,

  features: {
    analytics: true,
    onramp: true,
    swaps: false,
    email: false,
    socials: [],
    emailShowWallets: false,

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
    description: 'WSM20 Token Presale ',
    url: '',
    icons: ['/logo.png']
  },
  enableCoinbase: false,



  featuredWalletIds: [
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  ]
});

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [connected, setConnected] = useState(false);

  const { open, close } = useAppKit();
  const { address, chainId, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();

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
