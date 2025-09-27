// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CrossChainBridge
 * @dev Cross-chain bridge for Kadena Chainweb EVM
 * @notice This contract handles bridging between different chains in Kadena's network
 */
contract CrossChainBridge is Ownable, ReentrancyGuard {
    struct BridgeTransaction {
        uint256 bridgeId;
        address token;
        uint256 amount;
        uint256 sourceChainId;
        uint256 targetChainId;
        address recipient;
        address sender;
        bool isProcessed;
        uint256 timestamp;
        bytes32 txHash;
    }

    struct ChainInfo {
        uint256 chainId;
        string name;
        bool isActive;
        address bridgeContract; // Bridge contract on target chain
    }

    // State variables
    mapping(uint256 => BridgeTransaction) public bridges;
    mapping(uint256 => ChainInfo) public supportedChains;
    mapping(address => bool) public supportedTokens;
    mapping(bytes32 => bool) public processedTransactions;
    
    uint256 public bridgeCounter;
    uint256 public bridgeFee; // Fee in wei
    uint256 public minBridgeAmount; // Minimum amount to bridge
    
    // Events
    event BridgeInitiated(
        uint256 indexed bridgeId,
        address indexed token,
        uint256 amount,
        uint256 sourceChainId,
        uint256 targetChainId,
        address indexed recipient
    );
    
    event BridgeCompleted(
        uint256 indexed bridgeId,
        bytes32 indexed txHash,
        uint256 targetChainId
    );
    
    event ChainAdded(
        uint256 indexed chainId,
        string name,
        address bridgeContract
    );
    
    event TokenSupported(address indexed token, bool supported);
    
    event BridgeFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor() {
        bridgeFee = 0.001 ether; // 0.001 KDA fee
        minBridgeAmount = 0.01 ether; // 0.01 KDA minimum
    }

    /**
     * @dev Initiate a cross-chain bridge
     * @param _token Token address (0x0 for native KDA)
     * @param _amount Amount to bridge
     * @param _targetChainId Target chain ID
     * @param _recipient Recipient address on target chain
     */
    function initiateBridge(
        address _token,
        uint256 _amount,
        uint256 _targetChainId,
        address _recipient
    ) external payable nonReentrant {
        require(_amount >= minBridgeAmount, "Amount below minimum");
        require(_recipient != address(0), "Invalid recipient");
        require(supportedChains[_targetChainId].isActive, "Chain not supported");
        
        if (_token != address(0)) {
            require(supportedTokens[_token], "Token not supported");
            require(IERC20(_token).balanceOf(msg.sender) >= _amount, "Insufficient token balance");
            require(IERC20(_token).allowance(msg.sender, address(this)) >= _amount, "Insufficient allowance");
        } else {
            require(msg.value >= _amount + bridgeFee, "Insufficient KDA sent");
        }

        bridgeCounter++;
        bridges[bridgeCounter] = BridgeTransaction({
            bridgeId: bridgeCounter,
            token: _token,
            amount: _amount,
            sourceChainId: block.chainid,
            targetChainId: _targetChainId,
            recipient: _recipient,
            sender: msg.sender,
            isProcessed: false,
            timestamp: block.timestamp,
            txHash: bytes32(0)
        });

        // Transfer tokens to contract
        if (_token != address(0)) {
            IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        }

        emit BridgeInitiated(bridgeCounter, _token, _amount, block.chainid, _targetChainId, _recipient);
    }

    /**
     * @dev Complete a bridge transaction (called by bridge operator)
     * @param _bridgeId Bridge ID to complete
     * @param _txHash Transaction hash on target chain
     */
    function completeBridge(
        uint256 _bridgeId,
        bytes32 _txHash
    ) external onlyOwner {
        BridgeTransaction storage bridge = bridges[_bridgeId];
        require(!bridge.isProcessed, "Bridge already processed");
        require(block.timestamp >= bridge.timestamp + 1 hours, "Bridge not ready");

        bridge.isProcessed = true;
        bridge.txHash = _txHash;

        // Transfer tokens to recipient
        if (bridge.token != address(0)) {
            IERC20(bridge.token).transfer(bridge.recipient, bridge.amount);
        } else {
            payable(bridge.recipient).transfer(bridge.amount);
        }

        emit BridgeCompleted(_bridgeId, _txHash, bridge.targetChainId);
    }

    /**
     * @dev Add a supported chain
     * @param _chainId Chain ID
     * @param _name Chain name
     * @param _bridgeContract Bridge contract address on target chain
     */
    function addSupportedChain(
        uint256 _chainId,
        string memory _name,
        address _bridgeContract
    ) external onlyOwner {
        require(_chainId != block.chainid, "Cannot add current chain");
        require(_bridgeContract != address(0), "Invalid bridge contract");

        supportedChains[_chainId] = ChainInfo({
            chainId: _chainId,
            name: _name,
            isActive: true,
            bridgeContract: _bridgeContract
        });

        emit ChainAdded(_chainId, _name, _bridgeContract);
    }

    /**
     * @dev Add or remove supported token
     * @param _token Token address
     * @param _supported Whether token is supported
     */
    function setSupportedToken(address _token, bool _supported) external onlyOwner {
        supportedTokens[_token] = _supported;
        emit TokenSupported(_token, _supported);
    }

    /**
     * @dev Update bridge fee
     * @param _newFee New bridge fee
     */
    function updateBridgeFee(uint256 _newFee) external onlyOwner {
        uint256 oldFee = bridgeFee;
        bridgeFee = _newFee;
        emit BridgeFeeUpdated(oldFee, _newFee);
    }

    /**
     * @dev Update minimum bridge amount
     * @param _newMinAmount New minimum amount
     */
    function updateMinBridgeAmount(uint256 _newMinAmount) external onlyOwner {
        minBridgeAmount = _newMinAmount;
    }

    /**
     * @dev Get bridge transaction info
     * @param _bridgeId Bridge ID
     * @return bridge Bridge transaction info
     */
    function getBridgeInfo(uint256 _bridgeId) 
        external 
        view 
        returns (BridgeTransaction memory bridge) 
    {
        return bridges[_bridgeId];
    }

    /**
     * @dev Get supported chains
     * @return chains Array of supported chain IDs
     */
    function getSupportedChains() external view returns (uint256[] memory chains) {
        uint256 count = 0;
        for (uint256 i = 0; i < 100; i++) { // Assuming max 100 chains
            if (supportedChains[i].isActive) {
                count++;
            }
        }
        
        chains = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < 100; i++) {
            if (supportedChains[i].isActive) {
                chains[index] = i;
                index++;
            }
        }
    }

    /**
     * @dev Get bridge fee for an amount
     * @param _amount Amount to bridge
     * @return fee Bridge fee
     */
    function getBridgeFee(uint256 _amount) external view returns (uint256 fee) {
        return bridgeFee;
    }

    /**
     * @dev Emergency withdraw
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Emergency withdraw tokens
     * @param _token Token address
     */
    function emergencyWithdrawToken(address _token) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(_token).transfer(owner(), balance);
        }
    }

    // Allow contract to receive KDA
    receive() external payable {}
}
