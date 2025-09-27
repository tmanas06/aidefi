// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title KadenaDEX
 * @dev A simple DEX for Kadena Chainweb EVM with swap and bridge functionality
 */
contract KadenaDEX is Ownable, ReentrancyGuard {
    struct TokenInfo {
        address tokenAddress;
        string symbol;
        uint8 decimals;
        bool isActive;
        uint256 totalLiquidity;
    }

    struct SwapPair {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalSupply;
        bool isActive;
    }

    struct BridgeInfo {
        address token;
        uint256 amount;
        uint256 targetChainId;
        address recipient;
        bool isProcessed;
        uint256 timestamp;
    }

    // State variables
    mapping(address => TokenInfo) public tokens;
    mapping(bytes32 => SwapPair) public swapPairs;
    mapping(uint256 => BridgeInfo) public bridges;
    
    address[] public tokenList;
    uint256 public bridgeCounter;
    
    // Events
    event TokenAdded(address indexed token, string symbol, uint8 decimals);
    event LiquidityAdded(
        address indexed tokenA,
        address indexed tokenB,
        uint256 amountA,
        uint256 amountB,
        address indexed provider
    );
    event SwapExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address indexed user
    );
    event BridgeInitiated(
        uint256 indexed bridgeId,
        address indexed token,
        uint256 amount,
        uint256 targetChainId,
        address indexed recipient
    );
    event BridgeCompleted(uint256 indexed bridgeId);

    /**
     * @dev Add a new token to the DEX
     * @param tokenAddress The token contract address
     * @param symbol The token symbol
     * @param decimals The token decimals
     */
    function addToken(
        address tokenAddress,
        string memory symbol,
        uint8 decimals
    ) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(!tokens[tokenAddress].isActive, "Token already added");

        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            symbol: symbol,
            decimals: decimals,
            isActive: true,
            totalLiquidity: 0
        });

        tokenList.push(tokenAddress);
        emit TokenAdded(tokenAddress, symbol, decimals);
    }

    /**
     * @dev Add liquidity to a trading pair
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param amountA Amount of tokenA to add
     * @param amountB Amount of tokenB to add
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) external payable nonReentrant {
        require(tokens[tokenA].isActive, "Token A not active");
        require(tokens[tokenB].isActive, "Token B not active");
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        bytes32 pairKey = keccak256(abi.encodePacked(tokenA, tokenB));
        SwapPair storage pair = swapPairs[pairKey];

        if (pair.tokenA == address(0)) {
            // Create new pair
            pair.tokenA = tokenA;
            pair.tokenB = tokenB;
            pair.reserveA = amountA;
            pair.reserveB = amountB;
            pair.totalSupply = 1000; // Initial LP tokens
            pair.isActive = true;
        } else {
            // Add to existing pair
            require(pair.isActive, "Pair not active");
            
            // Calculate proportional amounts
            uint256 amountAOptimal = (amountB * pair.reserveA) / pair.reserveB;
            if (amountAOptimal <= amountA) {
                amountA = amountAOptimal;
            } else {
                amountB = (amountA * pair.reserveB) / pair.reserveA;
            }

            pair.reserveA += amountA;
            pair.reserveB += amountB;
        }

        // Transfer tokens from user
        if (tokenA != address(0)) {
            IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        } else {
            require(msg.value >= amountA, "Insufficient KDA sent");
        }

        if (tokenB != address(0)) {
            IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);
        }

        tokens[tokenA].totalLiquidity += amountA;
        tokens[tokenB].totalLiquidity += amountB;

        emit LiquidityAdded(tokenA, tokenB, amountA, amountB, msg.sender);
    }

    /**
     * @dev Execute a token swap
     * @param tokenIn Input token address (0x0 for KDA)
     * @param tokenOut Output token address (0x0 for KDA)
     * @param amountIn Amount of input token
     * @param minAmountOut Minimum amount of output token expected
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external payable nonReentrant {
        require(amountIn > 0, "Invalid amount");
        require(tokenIn != tokenOut, "Same token");

        bytes32 pairKey = keccak256(abi.encodePacked(tokenIn, tokenOut));
        SwapPair storage pair = swapPairs[pairKey];
        require(pair.isActive, "Pair not active");

        uint256 amountOut;
        if (pair.tokenA == tokenIn) {
            amountOut = (amountIn * pair.reserveB) / (pair.reserveA + amountIn);
            pair.reserveA += amountIn;
            pair.reserveB -= amountOut;
        } else {
            amountOut = (amountIn * pair.reserveA) / (pair.reserveB + amountIn);
            pair.reserveB += amountIn;
            pair.reserveA -= amountOut;
        }

        require(amountOut >= minAmountOut, "Insufficient output amount");

        // Transfer input token
        if (tokenIn != address(0)) {
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        } else {
            require(msg.value >= amountIn, "Insufficient KDA sent");
        }

        // Transfer output token
        if (tokenOut != address(0)) {
            IERC20(tokenOut).transfer(msg.sender, amountOut);
        } else {
            payable(msg.sender).transfer(amountOut);
        }

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut, msg.sender);
    }

    /**
     * @dev Initiate a cross-chain bridge
     * @param token Token to bridge (0x0 for KDA)
     * @param amount Amount to bridge
     * @param targetChainId Target chain ID
     * @param recipient Recipient address on target chain
     */
    function initiateBridge(
        address token,
        uint256 amount,
        uint256 targetChainId,
        address recipient
    ) external payable nonReentrant {
        require(amount > 0, "Invalid amount");
        require(recipient != address(0), "Invalid recipient");

        bridgeCounter++;
        bridges[bridgeCounter] = BridgeInfo({
            token: token,
            amount: amount,
            targetChainId: targetChainId,
            recipient: recipient,
            isProcessed: false,
            timestamp: block.timestamp
        });

        // Transfer tokens to contract
        if (token != address(0)) {
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        } else {
            require(msg.value >= amount, "Insufficient KDA sent");
        }

        emit BridgeInitiated(bridgeCounter, token, amount, targetChainId, recipient);
    }

    /**
     * @dev Complete a bridge transaction (called by bridge operator)
     * @param bridgeId Bridge ID to complete
     */
    function completeBridge(uint256 bridgeId) external onlyOwner {
        BridgeInfo storage bridge = bridges[bridgeId];
        require(!bridge.isProcessed, "Bridge already processed");
        require(block.timestamp >= bridge.timestamp + 1 hours, "Bridge not ready");

        bridge.isProcessed = true;

        // In a real implementation, this would interact with the target chain
        // For now, we just mark it as completed

        emit BridgeCompleted(bridgeId);
    }

    /**
     * @dev Get swap pair information
     * @param tokenA First token address
     * @param tokenB Second token address
     * @return pair The swap pair information
     */
    function getSwapPair(address tokenA, address tokenB) 
        external 
        view 
        returns (SwapPair memory pair) 
    {
        bytes32 pairKey = keccak256(abi.encodePacked(tokenA, tokenB));
        return swapPairs[pairKey];
    }

    /**
     * @dev Get all available tokens
     * @return tokenAddresses Array of token addresses
     */
    function getAllTokens() external view returns (address[] memory tokenAddresses) {
        return tokenList;
    }

    /**
     * @dev Get bridge information
     * @param bridgeId Bridge ID
     * @return bridge The bridge information
     */
    function getBridgeInfo(uint256 bridgeId) 
        external 
        view 
        returns (BridgeInfo memory bridge) 
    {
        return bridges[bridgeId];
    }

    // Allow contract to receive KDA
    receive() external payable {}
}
