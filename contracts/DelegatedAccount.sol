// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DelegatedAccount
 * @dev Manages delegated accounts with spending limits for AI automation
 */
contract DelegatedAccount is Ownable, ReentrancyGuard {
    struct SpendingLimit {
        address token; // Token address (0x0 for native KDA)
        uint256 amount; // Maximum amount that can be spent
        uint256 spent; // Amount already spent
        uint256 resetTime; // When the limit resets
        bool isActive; // Whether the limit is active
    }

    struct DelegatedAccountInfo {
        address account; // Delegated account address
        address owner; // Main account owner
        SpendingLimit[] limits; // Spending limits
        bool isActive; // Whether the account is active
        uint256 createdAt; // Creation timestamp
    }

    // Mapping from delegated account to its info
    mapping(address => DelegatedAccountInfo) public delegatedAccounts;
    
    // Mapping from owner to their delegated accounts
    mapping(address => address[]) public ownerDelegatedAccounts;
    
    // Events
    event DelegatedAccountCreated(
        address indexed owner,
        address indexed delegatedAccount,
        address[] tokens,
        uint256[] amounts
    );
    
    event SpendingLimitUpdated(
        address indexed delegatedAccount,
        address indexed token,
        uint256 newAmount
    );
    
    event TransactionExecuted(
        address indexed delegatedAccount,
        address indexed to,
        uint256 value,
        bytes data
    );
    
    event DelegatedAccountDeactivated(address indexed delegatedAccount);

    /**
     * @dev Create a new delegated account with spending limits
     * @param delegatedAccount The address of the delegated account
     * @param tokens Array of token addresses (0x0 for native KDA)
     * @param amounts Array of spending limits for each token
     */
    function createDelegatedAccount(
        address delegatedAccount,
        address[] memory tokens,
        uint256[] memory amounts
    ) external onlyOwner {
        require(delegatedAccount != address(0), "Invalid delegated account");
        require(tokens.length == amounts.length, "Arrays length mismatch");
        require(!delegatedAccounts[delegatedAccount].isActive, "Account already exists");

        DelegatedAccountInfo storage info = delegatedAccounts[delegatedAccount];
        info.account = delegatedAccount;
        info.owner = msg.sender;
        info.isActive = true;
        info.createdAt = block.timestamp;

        // Set spending limits
        for (uint256 i = 0; i < tokens.length; i++) {
            info.limits.push(SpendingLimit({
                token: tokens[i],
                amount: amounts[i],
                spent: 0,
                resetTime: block.timestamp + 24 hours, // Daily reset
                isActive: true
            }));
        }

        ownerDelegatedAccounts[msg.sender].push(delegatedAccount);

        emit DelegatedAccountCreated(msg.sender, delegatedAccount, tokens, amounts);
    }

    /**
     * @dev Execute a transaction through a delegated account
     * @param to Recipient address
     * @param value Amount of native KDA to send
     * @param data Transaction data
     */
    function executeTransaction(
        address to,
        uint256 value,
        bytes memory data
    ) external nonReentrant {
        DelegatedAccountInfo storage info = delegatedAccounts[msg.sender];
        require(info.isActive, "Delegated account not active");
        require(info.owner != address(0), "Account not found");

        // Check spending limits for native KDA
        if (value > 0) {
            _checkSpendingLimit(info, address(0), value);
            _updateSpentAmount(info, address(0), value);
        }

        // Execute the transaction
        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction failed");

        emit TransactionExecuted(msg.sender, to, value, data);
    }

    /**
     * @dev Update spending limit for a token
     * @param delegatedAccount The delegated account address
     * @param token The token address
     * @param newAmount The new spending limit
     */
    function updateSpendingLimit(
        address delegatedAccount,
        address token,
        uint256 newAmount
    ) external {
        DelegatedAccountInfo storage info = delegatedAccounts[delegatedAccount];
        require(info.owner == msg.sender, "Not the owner");
        require(info.isActive, "Account not active");

        for (uint256 i = 0; i < info.limits.length; i++) {
            if (info.limits[i].token == token) {
                info.limits[i].amount = newAmount;
                emit SpendingLimitUpdated(delegatedAccount, token, newAmount);
                return;
            }
        }

        // If token not found, add new limit
        info.limits.push(SpendingLimit({
            token: token,
            amount: newAmount,
            spent: 0,
            resetTime: block.timestamp + 24 hours,
            isActive: true
        }));

        emit SpendingLimitUpdated(delegatedAccount, token, newAmount);
    }

    /**
     * @dev Deactivate a delegated account
     * @param delegatedAccount The delegated account to deactivate
     */
    function deactivateDelegatedAccount(address delegatedAccount) external {
        DelegatedAccountInfo storage info = delegatedAccounts[delegatedAccount];
        require(info.owner == msg.sender, "Not the owner");
        
        info.isActive = false;
        emit DelegatedAccountDeactivated(delegatedAccount);
    }

    /**
     * @dev Get delegated account information
     * @param delegatedAccount The delegated account address
     * @return info The delegated account information
     */
    function getDelegatedAccountInfo(address delegatedAccount) 
        external 
        view 
        returns (DelegatedAccountInfo memory info) 
    {
        return delegatedAccounts[delegatedAccount];
    }

    /**
     * @dev Get all delegated accounts for an owner
     * @param owner The owner address
     * @return accounts Array of delegated account addresses
     */
    function getOwnerDelegatedAccounts(address owner) 
        external 
        view 
        returns (address[] memory accounts) 
    {
        return ownerDelegatedAccounts[owner];
    }

    /**
     * @dev Check if a delegated account can spend a certain amount
     * @param delegatedAccount The delegated account address
     * @param token The token address
     * @param amount The amount to check
     * @return canSpendAmount Whether the account can spend the amount
     * @return remainingAmount The remaining spendable amount
     */
    function canSpend(
        address delegatedAccount,
        address token,
        uint256 amount
    ) external view returns (bool canSpendAmount, uint256 remainingAmount) {
        DelegatedAccountInfo memory info = delegatedAccounts[delegatedAccount];
        require(info.isActive, "Account not active");

        for (uint256 i = 0; i < info.limits.length; i++) {
            if (info.limits[i].token == token && info.limits[i].isActive) {
                uint256 available = info.limits[i].amount - info.limits[i].spent;
                return (amount <= available, available);
            }
        }

        return (false, 0);
    }

    /**
     * @dev Internal function to check spending limits
     */
    function _checkSpendingLimit(
        DelegatedAccountInfo storage info,
        address token,
        uint256 amount
    ) internal view {
        for (uint256 i = 0; i < info.limits.length; i++) {
            if (info.limits[i].token == token && info.limits[i].isActive) {
                require(
                    info.limits[i].spent + amount <= info.limits[i].amount,
                    "Spending limit exceeded"
                );
                return;
            }
        }
        revert("No spending limit found for token");
    }

    /**
     * @dev Internal function to update spent amount
     */
    function _updateSpentAmount(
        DelegatedAccountInfo storage info,
        address token,
        uint256 amount
    ) internal {
        for (uint256 i = 0; i < info.limits.length; i++) {
            if (info.limits[i].token == token) {
                info.limits[i].spent += amount;
                return;
            }
        }
    }

    // Allow contract to receive KDA
    receive() external payable {}
}
