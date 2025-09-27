// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SimpleSwap
 * @dev Simple swap contract for KDA to token exchanges
 * @notice This is a basic implementation for testing and demonstration
 */
contract SimpleSwap is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public rate; // 1 KDA = rate tokens (in wei)
    uint256 public totalSwapped;
    uint256 public totalLiquidity;
    
    // Events
    event SwapExecuted(
        address indexed user,
        uint256 kdaAmount,
        uint256 tokenAmount,
        uint256 newRate
    );
    
    event LiquidityAdded(
        address indexed provider,
        uint256 kdaAmount,
        uint256 tokenAmount
    );
    
    event RateUpdated(uint256 oldRate, uint256 newRate);

    constructor(address _token, uint256 _initialRate) {
        token = IERC20(_token);
        rate = _initialRate; // e.g., 100 means 1 KDA = 100 tokens
    }

    /**
     * @dev Swap KDA for tokens
     */
    function swap() external payable nonReentrant {
        require(msg.value > 0, "Send KDA to swap");
        require(address(this).balance >= msg.value, "Insufficient contract balance");
        
        uint256 tokensToSend = (msg.value * rate) / 1e18; // Convert to token amount
        require(token.balanceOf(address(this)) >= tokensToSend, "Insufficient token liquidity");
        
        // Transfer tokens to user
        token.transfer(msg.sender, tokensToSend);
        
        totalSwapped += msg.value;
        
        emit SwapExecuted(msg.sender, msg.value, tokensToSend, rate);
    }

    /**
     * @dev Swap tokens for KDA
     * @param _tokenAmount Amount of tokens to swap
     */
    function swapTokensForKDA(uint256 _tokenAmount) external nonReentrant {
        require(_tokenAmount > 0, "Amount must be greater than 0");
        require(token.balanceOf(msg.sender) >= _tokenAmount, "Insufficient token balance");
        
        uint256 kdaToSend = (_tokenAmount * 1e18) / rate; // Convert to KDA amount
        require(address(this).balance >= kdaToSend, "Insufficient KDA liquidity");
        
        // Transfer tokens from user to contract
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        
        // Transfer KDA to user
        payable(msg.sender).transfer(kdaToSend);
        
        emit SwapExecuted(msg.sender, kdaToSend, _tokenAmount, rate);
    }

    /**
     * @dev Add liquidity to the swap pool
     * @param _tokenAmount Amount of tokens to add
     */
    function addLiquidity(uint256 _tokenAmount) external payable nonReentrant {
        require(msg.value > 0, "Send KDA for liquidity");
        require(_tokenAmount > 0, "Send tokens for liquidity");
        require(token.balanceOf(msg.sender) >= _tokenAmount, "Insufficient token balance");
        
        // Transfer tokens from user to contract
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        
        totalLiquidity += msg.value;
        
        emit LiquidityAdded(msg.sender, msg.value, _tokenAmount);
    }

    /**
     * @dev Update the exchange rate
     * @param _newRate New rate (1 KDA = _newRate tokens)
     */
    function updateRate(uint256 _newRate) external onlyOwner {
        require(_newRate > 0, "Rate must be greater than 0");
        
        uint256 oldRate = rate;
        rate = _newRate;
        
        emit RateUpdated(oldRate, _newRate);
    }

    /**
     * @dev Get current exchange rate
     * @return Current rate
     */
    function getRate() external view returns (uint256) {
        return rate;
    }

    /**
     * @dev Get contract balance
     * @return kdaBalance KDA balance
     * @return tokenBalance Token balance
     */
    function getBalances() external view returns (uint256 kdaBalance, uint256 tokenBalance) {
        return (address(this).balance, token.balanceOf(address(this)));
    }

    /**
     * @dev Get swap quote
     * @param _kdaAmount Amount of KDA to swap
     * @return tokenAmount Amount of tokens to receive
     */
    function getSwapQuote(uint256 _kdaAmount) external view returns (uint256 tokenAmount) {
        return (_kdaAmount * rate) / 1e18;
    }

    /**
     * @dev Get reverse swap quote
     * @param _tokenAmount Amount of tokens to swap
     * @return kdaAmount Amount of KDA to receive
     */
    function getReverseSwapQuote(uint256 _tokenAmount) external view returns (uint256 kdaAmount) {
        return (_tokenAmount * 1e18) / rate;
    }

    /**
     * @dev Emergency withdraw all funds
     */
    function emergencyWithdraw() external onlyOwner {
        // Transfer all KDA to owner
        payable(owner()).transfer(address(this).balance);
        
        // Transfer all tokens to owner
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance > 0) {
            token.transfer(owner(), tokenBalance);
        }
    }

    // Allow contract to receive KDA
    receive() external payable {}
}
