/**
 *Submitted for verification at basescan.org on 2024-09-30
*/

// SPDX-License-Identifier: UNLICENSED



/*
token address 0xA716C25e30Af41472bd51C92A643861d4Fa28021
usdt address 0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2
eth chainlink aggrigator 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70
tokens offer for presale 100000000000000000000 (18 decimal this test is 100 tokens)
softcapUSD 3000000 (6decimal usdt this test is 3 dollars)


*/




pragma solidity ^0.8;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address owner) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

interface Aggregator {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract Presale {
    address public owner;
    address public presaleTokenAddress;
    address public USDTAddress;
    address public chainlinkPricefeedEth;
    uint256 public totalTokensOfferedPresale;
    uint256 public softCapUSD;
    uint256 public totalContributionsUSD;
    bool public presaleSuccessful;
    bool public claimEnabled;
    bool public presaleCancelled;

    mapping(address => uint256) public ethContributions;
    mapping(address => uint256) public usdtContributions;

    event TokensPurchased(address indexed buyer, uint256 amountContributed);
    event TokensClaimed(address indexed claimer, uint256 amountClaimed);
    event PresaleSuccessful(uint256 totalContributionsUSD, uint256 totalTokensOfferedPresaleDistributed);
    event RefundIssued(address indexed user, uint256 amountRefunded);
    event ClaimEnabled();
    event PresaleCancelled();

    constructor(
        address _presaleTokenAddress,
        address _USDTAddress,
        address _chainlinkPricefeedEth,
        uint256 _totalTokensOfferedPresale,
        uint256 _softCapUSD
    ) {
        owner = msg.sender;
        presaleTokenAddress = _presaleTokenAddress;
        USDTAddress = _USDTAddress;
        chainlinkPricefeedEth = _chainlinkPricefeedEth;
        totalTokensOfferedPresale = _totalTokensOfferedPresale;
        softCapUSD = _softCapUSD;
        presaleSuccessful = false;
        claimEnabled = false;
        presaleCancelled = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier presaleNotCancelled() {
        require(!presaleCancelled, "Presale has been cancelled");
        _;
    }

    function getLatestETHPrice() public view returns (uint256) {
        (, int256 price, , ,) = Aggregator(chainlinkPricefeedEth).latestRoundData();
        return uint256(price * 10 ** 10);
    }

    function ethToUSD(uint256 ethAmount) public view returns (uint256) {
        uint256 ethPriceInUSD = getLatestETHPrice();
        uint256 ethInUSD = (ethAmount * ethPriceInUSD) / 1 ether;
        return ethInUSD / 1e12;
    }

    function usdtToUSD(uint256 usdtAmount) public pure returns (uint256) {
        return usdtAmount;
    }

    function contributeWithETH() external payable presaleNotCancelled {
        require(msg.value > 0, "Must contribute ETH");

        uint256 contributionInUSD = ethToUSD(msg.value);
        ethContributions[msg.sender] += msg.value;
        totalContributionsUSD += contributionInUSD;

        emit TokensPurchased(msg.sender, contributionInUSD);
    }

    function contributeWithUSDT(uint256 usdtAmount) external presaleNotCancelled {
        require(usdtAmount > 0, "Must contribute USDT");

        uint256 allowance = IERC20(USDTAddress).allowance(msg.sender, address(this));
        require(allowance >= usdtAmount, "USDT allowance too low");

        IERC20(USDTAddress).transferFrom(msg.sender, address(this), usdtAmount);
        usdtContributions[msg.sender] += usdtAmount;
        totalContributionsUSD += usdtToUSD(usdtAmount);

        emit TokensPurchased(msg.sender, usdtAmount);
    }

    function endPresale() external onlyOwner presaleNotCancelled {
        require(totalContributionsUSD >= softCapUSD, "Soft cap in USD not reached");
        presaleSuccessful = true;
        emit PresaleSuccessful(totalContributionsUSD, totalTokensOfferedPresale);
    }

    function cancelPresale() external onlyOwner presaleNotCancelled {
        presaleCancelled = true;
        emit PresaleCancelled();
    }

    function enableClaimTokens() external onlyOwner {
        require(presaleSuccessful, "Presale must be successful to enable claims");
        require(!presaleCancelled, "Cannot enable claims, presale was cancelled");
        claimEnabled = true;
        emit ClaimEnabled();
    }

    function claimTokens() external {
        require(presaleSuccessful, "Presale not successful");
        require(claimEnabled, "Token claim is not enabled");
        require(!presaleCancelled, "Presale was cancelled, no tokens to claim");

        uint256 userTotalContributionUSD = ethToUSD(ethContributions[msg.sender]) + usdtContributions[msg.sender];
        require(userTotalContributionUSD > 0, "No contributions from user");

        uint256 userSharePercentage = (userTotalContributionUSD * 1e6) / totalContributionsUSD;

        uint256 userTokenAmount = (totalTokensOfferedPresale * userSharePercentage) / 1e6;

        require(userTokenAmount > 0, "No tokens to claim");

        IERC20(presaleTokenAddress).transfer(msg.sender, userTokenAmount);

        ethContributions[msg.sender] = 0;
        usdtContributions[msg.sender] = 0;

        emit TokensClaimed(msg.sender, userTokenAmount);
    }

    function refund() external {
        require(presaleCancelled || totalContributionsUSD < softCapUSD, "No refunds, presale successful");

        uint256 ethContribution = ethContributions[msg.sender];
        if (ethContribution > 0) {
            ethContributions[msg.sender] = 0;
            payable(msg.sender).transfer(ethContribution);
            emit RefundIssued(msg.sender, ethContribution);
        }

        uint256 usdtContribution = usdtContributions[msg.sender];
        if (usdtContribution > 0) {
            usdtContributions[msg.sender] = 0;
            IERC20(USDTAddress).transfer(msg.sender, usdtContribution);
            emit RefundIssued(msg.sender, usdtContribution);
        }
    }

    function withdrawRemainingTokens() external onlyOwner {
        require(presaleSuccessful, "Presale not successful");
        require(!presaleCancelled, "Presale was cancelled, no withdrawal");
        uint256 remainingTokens = IERC20(presaleTokenAddress).balanceOf(address(this));
        IERC20(presaleTokenAddress).transfer(owner, remainingTokens);
    }

    function withdrawContributions() external onlyOwner {
        require(presaleSuccessful, "Presale not successful");
        require(!presaleCancelled, "Presale was cancelled, no withdrawal");

        payable(owner).transfer(address(this).balance);

        uint256 usdtBalance = IERC20(USDTAddress).balanceOf(address(this));
        IERC20(USDTAddress).transfer(owner, usdtBalance);
    }
}
