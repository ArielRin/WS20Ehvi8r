import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Progress, Input, Image, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { BrowserProvider, ethers } from 'ethers';
import {
  useAppKitProvider,
  useAppKitAccount,
  useAppKit,
} from '@reown/appkit/react';
import PresaleABI from './PresaleABI.json';

const contractAddress = '0xA716C25e30Af41472bd51C92A643861d4Fa28021';
const usdtAddress = '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2';

const PresaleComponent = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ethAmount, setEthAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'USDT'>('ETH');
  const [contract, setContract] = useState<ethers.Contract | null>(null); // Store contract instance

  // Reown AppKit hooks
  const { walletProvider } = useAppKitProvider(); // Get wallet provider from Reown
  const { open } = useAppKit(); // Open wallet connection modal
  const { address, isConnected } = useAppKitAccount(); // Get connected wallet address and status

  const targetDate = new Date('2024-11-05T00:00:00');

  // Countdown logic for presale timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Initialize contract after the wallet is connected
  useEffect(() => {
    const initializeContract = async () => {
      if (walletProvider && isConnected) {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        const presaleContract = new ethers.Contract(contractAddress, PresaleABI, signer);
        setContract(presaleContract); // Set the contract instance
      }
    };
    initializeContract();
  }, [walletProvider, isConnected]);

  // Handle purchasing with ETH
  const handleBuyWithETH = async () => {
    if (!contract) return; // Prevent interaction if contract is not initialized

    try {
      const transaction = await contract.contributeWithETH({
        value: ethers.parseEther(ethAmount),
      });
      await transaction.wait();
      alert('Transaction successful');
    } catch (error) {
      console.error('Error buying with ETH:', error.message || error);
      alert('Transaction failed');
    }
  };

  // Handle purchasing with USDT
  const handleBuyWithUSDT = async () => {
    if (!contract) return; // Prevent interaction if contract is not initialized

    try {
      const usdtContract = new ethers.Contract(usdtAddress, [
        {
          "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
          ],
          "name": "approve",
          "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ], contract.signer);

      // Approve USDT for the presale contract
      const approvalTx = await usdtContract.approve(contractAddress, ethers.parseUnits(usdtAmount, 6));
      await approvalTx.wait();

      // Contribute with USDT
      const transaction = await contract.contributeWithUSDT(ethers.parseUnits(usdtAmount, 6));
      await transaction.wait();

      alert('Transaction successful');
    } catch (error) {
      console.error('Error buying with USDT:', error.message || error);
      alert('Transaction failed');
    }
  };

  // Handle claiming tokens
  const handleClaimTokens = async () => {
    if (!contract) return; // Prevent interaction if contract is not initialized

    try {
      const transaction = await contract.claimTokens();
      await transaction.wait();

      alert('Tokens claimed successfully');
    } catch (error) {
      console.error('Error claiming tokens:', error.message || error);
      alert('Claim failed');
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
      {/* Presale countdown */}
      <Box textAlign="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Presale ending in</Text>
        <Text fontSize="4xl" mt={2}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </Text>
      </Box>

      {/* Total sold and progress */}
      <Box width="100%" mb={4}>
        <Text fontSize="xl" textAlign="center" mt={2}>Total Sold: 794,092/1,000,000,000</Text>
        <Progress value={16} size="lg" colorScheme="blue" borderRadius="md" mt={4} />
      </Box>

      {/* ETH and USDT buttons, claim button */}
      <Flex justifyContent="space-between" width="100%" mb={4} gap={4}>
        <Button
          flex={1}
          p={6}
          bg="gray.500"
          color="white"
          borderRadius="md"
          borderWidth="4px"
          borderColor={selectedToken === 'ETH' ? 'blue.500' : 'transparent'}
          onClick={() => setSelectedToken('ETH')}
          isDisabled={!isConnected} // Disable if wallet not connected
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image src="/images/eth.svg" alt="ETH Icon" boxSize="30px" mr={2} />
          ETH
        </Button>

        <Button
          flex={1}
          p={6}
          bg="gray.500"
          color="white"
          borderRadius="md"
          borderWidth="4px"
          borderColor={selectedToken === 'USDT' ? 'blue.500' : 'transparent'}
          onClick={() => setSelectedToken('USDT')}
          isDisabled={!isConnected} // Disable if wallet not connected
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image src="/images/usdt.svg" alt="USDT Icon" boxSize="30px" mr={2} />
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
          isDisabled={!isConnected} // Disable if wallet not connected
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image src="/images/claimbd.png" alt="Claim Icon" boxSize="30px" mr={2} />
          Claim
        </Button>
      </Flex>

      {/* Token amount input */}
      <Flex justifyContent="space-between" width="100%" mb={8}>
        <Box width="48%">
          <Text mb={2} fontSize="sm">Enter {selectedToken} amount</Text>
          <InputGroup>
            <InputLeftElement height="100%" display="flex" alignItems="center" pointerEvents="none">
              <Image src={selectedToken === 'ETH' ? "/images/eth.svg" : "/images/usdt.svg"} alt={`${selectedToken} Icon`} boxSize="32px" />
            </InputLeftElement>
            <Input
              bg="white"
              color="black"
              placeholder="Enter value"
              size="lg"
              borderRadius="md"
              textAlign="right"
              value={selectedToken === 'ETH' ? ethAmount : usdtAmount}
              onChange={(e) => selectedToken === 'ETH' ? setEthAmount(e.target.value) : setUsdtAmount(e.target.value)}
              isDisabled={!isConnected} // Disable input if wallet not connected
            />
          </InputGroup>
        </Box>

        <Box width="48%">
          <Text mb={2} fontSize="sm">$BABYDOGE Estimated</Text>
          <InputGroup>
            <InputLeftElement height="100%" display="flex" alignItems="center" pointerEvents="none">
              <Image src="/images/claimbd.png" alt="BABYDOGE Icon" boxSize="32px" />
            </InputLeftElement>
            <Input
              bg="white"
              color="black"
              placeholder="Estimated Tokens"
              size="lg"
              borderRadius="md"
              textAlign="right"
              isDisabled={!isConnected} // Disable input if wallet not connected
            />
          </InputGroup>
        </Box>
      </Flex>

      {/* Purchase button */}
      <Button
        colorScheme="blue"
        mt={4}
        width="100%"
        size="lg"
        borderRadius="xl"
        onClick={selectedToken === 'ETH' ? handleBuyWithETH : handleBuyWithUSDT}
        isDisabled={!isConnected} // Disable if wallet not connected
      >
        {selectedToken === 'ETH' ? 'Buy with ETH' : 'Buy with USDT'}
      </Button>

      {/* Add contract address under the buttons */}
      <Box mt={4} textAlign="center">
        <Text fontSize="md" fontWeight="bold">Token Address: {contractAddress}</Text>
      </Box>

      {/* Display connected wallet address at the bottom */}
      <Box mt={8} textAlign="center" color="gray.300">
        <Text fontSize="md">
          {isConnected ? `Connected Wallet: ${address}` : 'No wallet connected'}
        </Text>
      </Box>
    </Flex>
  );
};

export default PresaleComponent;
