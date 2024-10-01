import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Progress,
  Input,
  Image,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import {
  useAppKit,
  useAppKitAccount,
} from '@reown/appkit/react';
import PresaleABI from './PresaleABI.json';

const contractAddress = '0x89E1609aF5691bd4Dd79DBE66484f3D55f1723e9';
const usdtAddress = '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2';

const PresaleComponent = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [ethAmount, setEthAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'USDT'>('ETH');
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const { provider, open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  // Countdown Timer Logic (unchanged)

  // Initialize Contract using ethers.js Web3Provider
  useEffect(() => {
    const initializeContract = async () => {
      console.log('Initializing contract...');
      console.log('provider:', provider);
      console.log('isConnected:', isConnected);

      const ethereum = provider || (window as any).ethereum;

      if (ethereum && isConnected) {
        try {
          const ethersProvider = new ethers.providers.Web3Provider(ethereum);
          const signer = ethersProvider.getSigner();
          console.log('Signer:', signer);

          const presaleContract = new ethers.Contract(
            contractAddress,
            PresaleABI,
            signer
          );
          setContract(presaleContract);
          console.log('Contract initialized:', presaleContract);
        } catch (error: any) {
          console.error('Error initializing contract:', error);
          alert(`Error initializing contract: ${error.message || error}`);
        }
      } else {
        console.log('Ethereum provider or isConnected not available');
      }
    };
    initializeContract();
  }, [provider, isConnected]);


  const handleBuyWithETH = async () => {
    if (!contract) {
      console.log('No contract available');
      return;
    }

    try {
      const tx = await contract.contributeWithETH({
        value: ethers.parseEther(ethAmount),
      });
      await tx.wait();
      console.log('Transaction successful:', tx);
      alert('Transaction successful');
    } catch (error: any) {
      console.error('Error buying with ETH:', error);
      alert(`Error buying with ETH: ${error.message || error}`);
    }
  };

  const handleBuyWithUSDT = async () => {
    if (!contract) {
      console.log('No contract available');
      return;
    }

    try {
      const signer = contract.signer;

      const usdtContract = new ethers.Contract(
        usdtAddress,
        [
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        signer
      );

      const approvalTx = await usdtContract.approve(
        contractAddress,
        ethers.parseUnits(usdtAmount, 6)
      );
      await approvalTx.wait();

      const tx = await contract.contributeWithUSDT(
        ethers.parseUnits(usdtAmount, 6)
      );
      await tx.wait();
      console.log('Transaction successful:', tx);
      alert('Transaction successful');
    } catch (error: any) {
      console.error('Error buying with USDT:', error);
      alert(`Error buying with USDT: ${error.message || error}`);
    }
  };

  const handleClaimTokens = async () => {
    if (!contract) {
      console.log('No contract available');
      return;
    }

    try {
      const tx = await contract.claimTokens();
      await tx.wait();
      console.log('Tokens claimed successfully:', tx);
      alert('Tokens claimed successfully');
    } catch (error: any) {
      console.error('Error claiming tokens:', error);
      alert(`Error claiming tokens: ${error.message || error}`);
    }
  };



  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      p={6}
      borderRadius="xl"
      boxShadow="xl"
      bg="rgba(0, 0, 0, 0.7)"
      color="white"
      width="100%"
    >
      <Box textAlign="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Presale ending in
        </Text>
        <Text fontSize="4xl" mt={2}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
          {timeLeft.seconds}s
        </Text>
      </Box>

      <Box width="100%" mb={4}>
        <Text fontSize="xl" textAlign="center" mt={2}>
          Total Sold: 794,092/1,000,000,000
        </Text>
        <Progress
          value={16}
          size="lg"
          colorScheme="blue"
          borderRadius="md"
          mt={4}
        />
      </Box>

      <Flex justifyContent="space-between" width="100%" mb={4} gap={4}>
        <Button
          flex={1}
          p={6}
          bg="gray.500"
          color="white"
          borderRadius="md"
          borderWidth="4px"
          borderColor={
            selectedToken === 'ETH' ? 'blue.500' : 'transparent'
          }
          onClick={() => setSelectedToken('ETH')}
          isDisabled={!isConnected}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src="/images/eth.svg"
            alt="ETH Icon"
            boxSize="30px"
            mr={2}
          />
          ETH
        </Button>

        <Button
          flex={1}
          p={6}
          bg="gray.500"
          color="white"
          borderRadius="md"
          borderWidth="4px"
          borderColor={
            selectedToken === 'USDT' ? 'blue.500' : 'transparent'
          }
          onClick={() => setSelectedToken('USDT')}
          isDisabled={!isConnected}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src="/images/usdt.svg"
            alt="USDT Icon"
            boxSize="30px"
            mr={2}
          />
          USDT
        </Button>

        <Button
          flex={1}
          p={6}
          bg="gray.500"
          color="white"
          borderRadius="md"
          borderWidth="4px"
          borderColor="transparent"
          onClick={handleClaimTokens}
          isDisabled={!isConnected}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src="/images/claimbd.png"
            alt="Claim Icon"
            boxSize="30px"
            mr={2}
          />
          Claim
        </Button>
      </Flex>

      <Flex justifyContent="space-between" width="100%" mb={8}>
        <Box width="48%">
          <Text mb={2} fontSize="sm">
            Enter {selectedToken} amount
          </Text>
          <InputGroup>
            <InputLeftElement
              height="100%"
              display="flex"
              alignItems="center"
              pointerEvents="none"
            >
              <Image
                src={
                  selectedToken === 'ETH'
                    ? '/images/eth.svg'
                    : '/images/usdt.svg'
                }
                alt={`${selectedToken} Icon`}
                boxSize="32px"
              />
            </InputLeftElement>
            <Input
              bg="white"
              color="black"
              placeholder="Enter value"
              size="lg"
              borderRadius="md"
              textAlign="right"
              value={
                selectedToken === 'ETH' ? ethAmount : usdtAmount
              }
              onChange={(e) =>
                selectedToken === 'ETH'
                  ? setEthAmount(e.target.value)
                  : setUsdtAmount(e.target.value)
              }
              isDisabled={!isConnected}
            />
          </InputGroup>
        </Box>

        <Box width="48%">
          <Text mb={2} fontSize="sm">
            $BABYDOGE Estimated
          </Text>
          <InputGroup>
            <InputLeftElement
              height="100%"
              display="flex"
              alignItems="center"
              pointerEvents="none"
            >
              <Image
                src="/images/claimbd.png"
                alt="BABYDOGE Icon"
                boxSize="32px"
              />
            </InputLeftElement>
            <Input
              bg="white"
              color="black"
              placeholder="Estimated Tokens"
              size="lg"
              borderRadius="md"
              textAlign="right"
              isDisabled
            />
          </InputGroup>
        </Box>
      </Flex>

      {!isConnected ? (
        <Button
          colorScheme="blue"
          mt={4}
          width="100%"
          size="lg"
          borderRadius="xl"
          onClick={open}
        >
          Connect Wallet
        </Button>
      ) : (
        <Button
          colorScheme="blue"
          mt={4}
          width="100%"
          size="lg"
          borderRadius="xl"
          onClick={
            selectedToken === 'ETH'
              ? handleBuyWithETH
              : handleBuyWithUSDT
          }
        >
          {selectedToken === 'ETH'
            ? 'Buy with ETH'
            : 'Buy with USDT'}
        </Button>
      )}

      <Box mt={4} textAlign="center">
        <Text fontSize="md" fontWeight="bold">
          Token Address: {contractAddress}
        </Text>
      </Box>

      <Box mt={8} textAlign="center" color="gray.300">
        <Text fontSize="md">
          {isConnected
            ? `Connected Wallet: ${address}`
            : 'No wallet connected'}
        </Text>
      </Box>
    </Flex>
  );
};

export default PresaleComponent;
