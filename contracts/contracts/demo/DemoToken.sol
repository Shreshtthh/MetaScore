// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "../interfaces/IActivityTracker.sol";

contract DemoToken {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    
    string public name = "Demo Token";
    string public symbol = "DEMO";
    uint256 public totalSupply;
    uint8 public decimals = 18;
    
    address public immutable ACTIVITY_TRACKER;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(address _activityTracker) {
        ACTIVITY_TRACKER = _activityTracker;
    }
    
    function mint() external {
        uint256 amount = 1000 * 10**decimals;
        balances[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
        
        // Notify MetaScore system
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "defi",
            15,
            "Token Minting"
        );
    }
    
    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        
        // Track DeFi activity
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "defi",
            10,
            "Token Transfer"
        );
    }
    
    function approve(address spender, uint256 amount) external {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        
        // Track DeFi sophistication
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "defi",
            5,
            "Token Approval"
        );
    }
    
    function transferFrom(address from, address to, uint256 amount) external {
        require(allowances[from][msg.sender] >= amount, "Insufficient allowance");
        require(balances[from] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient");
        
        allowances[from][msg.sender] -= amount;
        balances[from] -= amount;
        balances[to] += amount;
        
        emit Transfer(from, to, amount);
        
        // Track advanced DeFi activity
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "defi",
            12,
            "Delegated Transfer"
        );
    }
    
    // View functions
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
    
    function allowance(address owner, address spender) external view returns (uint256) {
        return allowances[owner][spender];
    }
}
