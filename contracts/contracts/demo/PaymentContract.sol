// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IActivityTracker.sol";

contract PaymentContract is ReentrancyGuard {
    mapping(address => uint256) public donations;
    mapping(address => uint256) public paymentsSent;
    mapping(address => uint256) public paymentsReceived;
    
    uint256 public totalDonations;
    uint256 public totalPayments;
    
    address public immutable ACTIVITY_TRACKER;
    address public immutable treasury;
    
    event Donation(address indexed donor, uint256 amount, string message);
    event Payment(address indexed payer, address indexed recipient, uint256 amount, string memo);
    
    constructor(address _activityTracker, address _treasury) {
        require(_activityTracker != address(0), "Invalid tracker address");
        require(_treasury != address(0), "Invalid treasury address");
        ACTIVITY_TRACKER = _activityTracker;
        treasury = _treasury;
    }
    
    function donate(string memory message) external payable nonReentrant {
        require(msg.value > 0, "Must send STT");
        require(bytes(message).length <= 200, "Message too long");
        
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;
        
        emit Donation(msg.sender, msg.value, message);
        
        // Calculate points based on donation amount
        uint256 points;
        if (msg.value >= 1 ether) {
            points = 25; // Large donation
        } else if (msg.value >= 0.1 ether) {
            points = 15; // Medium donation
        } else {
            points = 10; // Small donation
        }
        
        // Track social/payment activity
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "social",
            points,
            "Donation"
        );
    }
    
    function sendPayment(address recipient, string memory memo) external payable nonReentrant {
        require(msg.value > 0, "Must send STT");
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot pay yourself");
        require(bytes(memo).length <= 100, "Memo too long");
        
        paymentsSent[msg.sender] += msg.value;
        paymentsReceived[recipient] += msg.value;
        totalPayments += msg.value;
        
        // Send payment
        (bool success, ) = payable(recipient).call{value: msg.value}("");
        require(success, "Payment failed");
        
        emit Payment(msg.sender, recipient, msg.value, memo);
        
        // Track payment activity for sender
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "social",
            15,
            "P2P Payment"
        );
        
        // Track receiving activity (smaller points)
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            recipient,
            "social",
            5,
            "Payment Received"
        );
    }
    
    // View functions
    function getUserStats(address user) external view returns (
        uint256 donationsAmount,
        uint256 sentAmount,
        uint256 receivedAmount
    ) {
        return (
            donations[user],
            paymentsSent[user],
            paymentsReceived[user]
        );
    }
    
    function getContractStats() external view returns (
        uint256 totalDonated,
        uint256 totalTransacted,
        uint256 contractBalance
    ) {
        return (
            totalDonations,
            totalPayments,
            address(this).balance
        );
    }
}
