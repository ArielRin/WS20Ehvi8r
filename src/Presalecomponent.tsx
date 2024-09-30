import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Progress, Input, Image, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useAppKit, useWalletInfo } from '@reown/appkit/react';
import PresaleABI from './PresaleABI.json'; // Assuming ABI file is present

const contractAddress = '0x0377eDA65bb8A04D565f2166FB51AC9fEDdb05D9'; // Presale contract address
const usdtAddress = '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2'; // USDT token address

const PresaleComponent = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ethAmount, setEthAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'USDT'>('ETH');

  const { walletInfo } = useWalletInfo(); // Get wallet information from Reown AppKit
  const { open } = useAppKit(); // Hook to control modal

  // Countdown target date
  const targetDate = new Date('2024-11-05T00:00:00');

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

  const handleBuyWithETH = async () => {
    if (!ethAmount || isNaN(Number(ethAmount))) {
      alert('Please enter a valid ETH amount');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(walletInfo.provider); // Use provider from walletInfo
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PresaleABI, signer);

      const transaction = await contract.contributeWithETH({
        value: ethers.parseEther(ethAmount), // Convert ETH to correct format
      });

      await transaction.wait();
      alert('Transaction successful');
    } catch (error) {
      console.error('Error buying with ETH:', error);
      alert('Transaction failed');
    }
  };

  const handleBuyWithUSDT = async () => {
    if (!usdtAmount || isNaN(Number(usdtAmount))) {
      alert('Please enter a valid USDT amount');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(walletInfo.provider); // Use provider from walletInfo
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, PresaleABI, signer);
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
      ], signer);

      // Approve USDT transfer to the presale contract
      const approvalTx = await usdtContract.approve(contractAddress, ethers.parseUnits(usdtAmount, 6)); // 6 decimals for USDT
      await approvalTx.wait();

      // Now contribute to presale
      const transaction = await contract.contributeWithUSDT(ethers.parseUnits(usdtAmount, 6)); // 6 decimals for USDT
      await transaction.wait();

      alert('Transaction successful');
    } catch (error) {
      console.error('Error buying with USDT:', error);
      alert('Transaction failed');
    }
  };

  const handleClaimTokens = async () => {
    try {
      const provider = new ethers.BrowserProvider(walletInfo.provider); // Use provider from walletInfo
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PresaleABI, signer);

      const transaction = await contract.claimTokens();
      await transaction.wait();

      alert('Tokens claimed successfully');
    } catch (error) {
      console.error('Error claiming tokens:', error);
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
      {/* Countdown Timer */}
      <Box textAlign="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Presale ending in</Text>
        <Text fontSize="4xl" mt={2}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </Text>
      </Box>

      {/* Progress and Stats */}
      <Box width="100%" mb={4}>
        <Text fontSize="xl" textAlign="center" mt={2}>Total Sold: 794,092/1,000,000,000</Text>
        <Progress value={16} size="lg" colorScheme="blue" borderRadius="md" mt={4} />
      </Box>

      {/* Token Toggle Buttons */}
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
          borderColor="transparent" // Keeps consistent border
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleClaimTokens}
        >
          <Image src="/images/claimbd.png" alt="Claim Icon" boxSize="30px" mr={2} />
          Claim
        </Button>
      </Flex>

      {/* Input Section */}
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
            />
          </InputGroup>
        </Box>

        {/* Estimated BABYDOGE Tokens */}
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
            />
          </InputGroup>
        </Box>
      </Flex>

      {/* Action Buttons */}
      <Button
        colorScheme="blue"
        mt={4}
        width="100%"
        size="lg"
        borderRadius="xl"
        onClick={selectedToken === 'ETH' ? handleBuyWithETH : handleBuyWithUSDT}
      >
        {selectedToken === 'ETH' ? 'Buy with ETH' : 'Buy with USDT'}
      </Button>
    </Flex>
  );
};

export default PresaleComponent;
