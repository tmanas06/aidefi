// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AIDelegate
 * @dev Manual delegation system for AI bot with spending limits
 * @notice This replaces BrewIt delegation with a simpler, more direct approach
 */
contract AIDelegate is Ownable, ReentrancyGuard {
    struct DelegateInfo {
        address delegate;
        uint256 spendingLimit;
        uint256 spentAmount;
        bool isActive;
        uint256 createdAt;
        string[] allowedFunctions; // Functions the delegate can call
    }

    // Mapping from delegate address to their info
    mapping(address => DelegateInfo) public delegates;
    
    // Mapping from owner to their delegates
    mapping(address => address[]) public ownerDelegates;
    
    // Events
    event DelegateCreated(
        address indexed owner,
        address indexed delegate,
        uint256 spendingLimit,
        string[] allowedFunctions
    );
    
    event DelegateExecuted(
        address indexed delegate,
        address indexed to,
        uint256 value,
        bytes data,
        bool success
    );
    
    event SpendingLimitUpdated(
        address indexed delegate,
        uint256 newLimit
    );
    
    event DelegateDeactivated(address indexed delegate);

    constructor() {
        // Owner is set automatically
    }

    /**
     * @dev Create a new delegated account for AI bot
     * @param _delegate The address of the AI bot
     * @param _spendingLimit Maximum amount the bot can spend (in wei)
     * @param _allowedFunctions Array of function signatures the bot can call
     */
    function createDelegatedAccount(
        address _delegate,
        uint256 _spendingLimit,
        string[] memory _allowedFunctions
    ) external onlyOwner {
        require(_delegate != address(0), "Invalid delegate address");
        require(_spendingLimit > 0, "Spending limit must be greater than 0");
        require(!delegates[_delegate].isActive, "Delegate already exists");

        delegates[_delegate] = DelegateInfo({
            delegate: _delegate,
            spendingLimit: _spendingLimit,
            spentAmount: 0,
            isActive: true,
            createdAt: block.timestamp,
            allowedFunctions: _allowedFunctions
        });

        ownerDelegates[msg.sender].push(_delegate);

        emit DelegateCreated(msg.sender, _delegate, _spendingLimit, _allowedFunctions);
    }

    /**
     * @dev Execute a transaction via delegated account
     * @param _to Recipient address
     * @param _value Amount of KDA to send
     * @param _data Transaction data
     */
    function executeViaDelegate(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) external payable nonReentrant {
        DelegateInfo storage delegateInfo = delegates[msg.sender];
        require(delegateInfo.isActive, "Delegate not active");
        require(delegateInfo.spentAmount + _value <= delegateInfo.spendingLimit, "Exceeds spending limit");

        // Update spent amount
        delegateInfo.spentAmount += _value;

        // Execute the transaction
        (bool success, ) = _to.call{value: _value}(_data);
        
        emit DelegateExecuted(msg.sender, _to, _value, _data, success);
        
        require(success, "Delegate call failed");
    }

    /**
     * @dev Execute a token transfer via delegated account
     * @param _token Token contract address
     * @param _to Recipient address
     * @param _amount Amount to transfer
     */
    function executeTokenTransfer(
        address _token,
        address _to,
        uint256 _amount
    ) external {
        DelegateInfo storage delegateInfo = delegates[msg.sender];
        require(delegateInfo.isActive, "Delegate not active");
        
        // Build transfer data
        bytes memory data = abi.encodeWithSignature("transfer(address,uint256)", _to, _amount);
        
        // Execute via delegate
        this.executeViaDelegate(_token, 0, data);
    }

    /**
     * @dev Update spending limit for a delegate
     * @param _delegate Delegate address
     * @param _newLimit New spending limit
     */
    function updateSpendingLimit(
        address _delegate,
        uint256 _newLimit
    ) external onlyOwner {
        require(delegates[_delegate].isActive, "Delegate not found");
        require(_newLimit > delegates[_delegate].spentAmount, "New limit too low");
        
        delegates[_delegate].spendingLimit = _newLimit;
        emit SpendingLimitUpdated(_delegate, _newLimit);
    }

    /**
     * @dev Reset spent amount (daily reset)
     * @param _delegate Delegate address
     */
    function resetSpentAmount(address _delegate) external onlyOwner {
        require(delegates[_delegate].isActive, "Delegate not found");
        delegates[_delegate].spentAmount = 0;
    }

    /**
     * @dev Deactivate a delegate
     * @param _delegate Delegate address
     */
    function deactivateDelegate(address _delegate) external onlyOwner {
        require(delegates[_delegate].isActive, "Delegate not found");
        delegates[_delegate].isActive = false;
        emit DelegateDeactivated(_delegate);
    }

    /**
     * @dev Get delegate information
     * @param _delegate Delegate address
     * @return info Delegate information
     */
    function getDelegateInfo(address _delegate) 
        external 
        view 
        returns (DelegateInfo memory info) 
    {
        return delegates[_delegate];
    }

    /**
     * @dev Get all delegates for an owner
     * @param _owner Owner address
     * @return delegateAddresses Array of delegate addresses
     */
    function getOwnerDelegates(address _owner) 
        external 
        view 
        returns (address[] memory delegateAddresses) 
    {
        return ownerDelegates[_owner];
    }

    /**
     * @dev Check if delegate can spend amount
     * @param _delegate Delegate address
     * @param _amount Amount to check
     * @return canSpendAmount Whether delegate can spend the amount
     * @return remainingAmount Remaining spendable amount
     */
    function canSpend(address _delegate, uint256 _amount) 
        external 
        view 
        returns (bool canSpendAmount, uint256 remainingAmount) 
    {
        DelegateInfo memory info = delegates[_delegate];
        if (!info.isActive) return (false, 0);
        
        remainingAmount = info.spendingLimit - info.spentAmount;
        canSpendAmount = _amount <= remainingAmount;
    }

    /**
     * @dev Emergency function to withdraw all funds
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Allow contract to receive KDA
    receive() external payable {}
}
