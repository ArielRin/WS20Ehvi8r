
# WSM20 Presale Smart Contract

This repository contains the code for a **WSM20 Presale Smart Contract** deployed on Ethereum-based networks (EVM's). It supports contributions in both **ETH** and **USDT**, with functionality to set a soft cap in USD. After the presale is successful, contributors can claim tokens, or they can get a refund if the presale is canceled or the soft cap is not reached.

## Overview

The **Presale Smart Contract** allows project owners to conduct a token presale with a soft cap in USD. Contributors can participate using ETH or USDT. Once the presale's soft cap is reached, the owner can manually enable token claims for users, or if the soft cap is not reached, users can claim a refund.

### Benefits
- **Dual currency support:** Users can contribute with ETH or USDT.
- **USD soft cap:** The contract uses Chainlink's ETH/USD price feed to convert ETH contributions to USD.
- **Refund mechanism:** Users can claim refunds if the presale is canceled or if the soft cap is not reached.
- **Manual control:** The owner has full control over the presale’s lifecycle (starting, ending, enabling claims, and withdrawing contributions).

### Features
- **ETH and USDT contributions:** Users can participate using ETH or USDT.
- **Soft cap in USD:** Soft cap is denominated in USD (with 6 decimals).
- **Manual token claim:** The owner can enable token claims once the presale is successful.
- **Refund functionality:** Refunds are available if the soft cap is not reached or the presale is canceled.
- **Presale cancellation:** The owner can cancel the presale at any time, allowing refunds.
- **Withdraw functions:** The owner can withdraw ETH/USDT contributions and remaining tokens once the presale is successful.

---

## Contract Functions

### Owner Functions:
- `endPresale()`: Ends the presale if the soft cap is reached.
- `cancelPresale()`: Cancels the presale at any time, enabling refunds.
- `enableClaimTokens()`: Enables users to claim tokens after the presale is successful.
- `withdrawRemainingTokens()`: Withdraws any remaining unsold tokens after the presale ends.
- `withdrawContributions()`: Withdraws the ETH and USDT contributions after the presale is successful.

### User Functions:
- `contributeWithETH()`: Contribute to the presale using ETH.
- `contributeWithUSDT()`: Contribute to the presale using USDT.
- `claimTokens()`: Claim presale tokens once the presale is successful and claims are enabled.
- `refund()`: Claim a refund if the presale is canceled or the soft cap is not reached.

---

## Contract Logic

### Presale Lifecycle
1. **Contributions**:
   - Users can contribute ETH or USDT to the presale.
   - ETH contributions are converted to USD using Chainlink’s ETH/USD price feed.
   - All contributions are aggregated and tracked in USD (with 6 decimals).

2. **Ending the Presale**:
   - The owner can call `endPresale()` when the soft cap (set in USD) is reached. This marks the presale as successful.

3. **Cancelling the Presale**:
   - The owner can cancel the presale by calling `cancelPresale()`, enabling users to claim refunds.

4. **Claiming Tokens**:
   - Once the presale ends successfully, the owner can call `enableClaimTokens()` to allow users to claim their share of tokens based on their contribution.

5. **Refunds**:
   - If the presale is canceled or the soft cap is not reached, users can call `refund()` to reclaim their contributions.

6. **Owner Withdrawals**:
   - After the presale ends successfully, the owner can withdraw the contributions (ETH and USDT) using `withdrawContributions()`.

---

## Deployment

To deploy the contract, follow these steps:

1. **Clone the repository**:


2. **Compile the contract**:
    Use a Solidity compiler or tools like Hardhat or Remix to compile the contract.

3. **Deploy the contract**:
    - Use Remix or Hardhat to deploy the contract to your desired network.
    - Provide the following constructor arguments:
      - `_presaleTokenAddress`: Address of the presale token (ERC-20).
      - `_USDTAddress`: Address of the USDT token on the network.
      - `_chainlinkPricefeedEth`: Address of the Chainlink ETH/USD price feed.
      - `_totalTokensOfferedPresale`: Total number of tokens to be offered for the presale (in 18 decimals).
      - `_softCapUSD`: Soft cap in USD (6 decimals).

---

## Instructions for Owner

### Start the Presale

1. **Set up the contract**:
   Deploy the contract with the correct token addresses, price feed, token supply, and soft cap.

2. **Contributions**:
   - Users contribute using ETH or USDT via `contributeWithETH()` or `contributeWithUSDT()`.

3. **End the Presale**:
   Once the soft cap is reached, call `endPresale()` to end the presale and mark it as successful.

4. **Enable Token Claims**:
   After ensuring liquidity is set up, call `enableClaimTokens()` to allow users to claim their tokens.

5. **Withdraw Contributions**:
   Once users have claimed their tokens, call `withdrawContributions()` to withdraw the ETH and USDT contributions.

6. **Withdraw Remaining Tokens**:
   If there are any unsold tokens, call `withdrawRemainingTokens()` to retrieve them.

---

## Instructions for Users

### Contributing to the Presale
1. **Contribute with ETH**:
   Call `contributeWithETH()` and send the desired amount of ETH.

2. **Contribute with USDT**:
   Call `contributeWithUSDT()` with the desired USDT amount, ensuring you have approved the contract to spend your USDT.

### Claiming Tokens
1. **Wait for the Presale to End**:
   After the presale ends successfully, the owner will enable token claims.

2. **Claim Your Tokens**:
   Call `claimTokens()` to claim your share of presale tokens based on your contribution.

### Refunds
1. **Refunds Available if the Presale is Canceled or Soft Cap is Not Reached**:
   Call `refund()` to reclaim your ETH or USDT if the presale is canceled or the soft cap is not reached.

---

## Example Deployment and Function Calls

### Deploy the Contract (via Remix or Hardhat):
```solidity
_presaleTokenAddress: 0xA716C25e30Af41472bd51C92A643861d4Fa28021
_USDTAddress: 0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2
_chainlinkPricefeedEth: 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70
_totalTokensOfferedPresale: 100000000000000000000 // 100 tokens in 18 decimals
_softCapUSD: 3000000 // 3 USD in 6 decimals
```

### Ending the Presale:
```solidity
// Call this once soft cap is reached
endPresale();
```

### Cancelling the Presale:
```solidity
// Call this if you want to cancel the presale at any time
cancelPresale();
```

### Enabling Claims:
```solidity
// Call this after the presale ends and liquidity is set up
enableClaimTokens();
```

### Withdrawing Contributions (For Owner):
```solidity
// Call this after presale ends successfully and users have claimed tokens
withdrawContributions();
```

### User Refunds (If Presale is Canceled or Soft Cap Not Reached):
```solidity
// Users can call this to get their contributions back
refund();
```

---

## License

This contract is provided under an **UNLICENSED** license. All rights reserved.

---
