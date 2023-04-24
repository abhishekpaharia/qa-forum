// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./RewardPoint.sol";
contract QAForum {

    // Define the structure for questions
    struct Question {
        uint id;
        string text;
        address questioner;
        uint reward;
        uint[] answerIds;
        bool resolved;
    }
    
    // Define the structure for answers
    struct Answer {
        uint id;
        string text;
        address answerer;
        uint reward;
        uint questionId;
        bool accepted;
    }
    
    // Define the structure for users
    struct User {
        uint id;
        string username;
        uint balance;
        bool banned;
    }
    
    // Define variables
    uint usid=1; 
    uint questionCounter;
    uint answerCounter;
    uint userCounter;
    mapping(uint => Question) public questions;
    mapping(uint => Answer) public answers;
    mapping(address => User) public users;
    mapping(address => bool) public moderators;
    uint public constant TOKEN_PRICE = 1e18 wei;
    RewardPoint rp;
    address public owner;
    
    // Define events
    event UserRegistered(uint indexed id, string username, uint balance);
    event QuestionAsked(uint indexed questionId, string text, address questioner);
    event AnswerGiven(uint indexed answerId, string text, address answerer);
    event QuestionResolved(uint indexed questionId);
    event AnswerAccepted(uint indexed answerId, uint indexed questionId);
    event UserBanned(address user);
    event UserUnbanned(address user);
    event TokensPurchased(address indexed user, uint amount);
    
    // Define modifiers
    modifier onlyModerator() {
        require(moderators[msg.sender], "You are not a moderator.");
        _;
    }
    
    modifier notBanned() {
        require(!users[msg.sender].banned, "You are banned.");
        _;
    }
    
    // Functions for users
    
    constructor() {
        rp = new RewardPoint();
        owner = msg.sender;
    }

    function isUser() public view returns (bool) {
        if(users[msg.sender].id == 0) {
            return false;
        } 
        return true;
    }
    function registerUser(string memory username) public {
        require(bytes(username).length > 0, "Username should not be empty.");
        require(users[msg.sender].id == 0, "User already registered.");
        
        usid++;
        userCounter++;
        users[msg.sender] = User(userCounter, username, 0, false);
        emit UserRegistered(userCounter, username, 0);
    }
    
    function purchaseTokens(uint tokenCount) public payable {
        require(users[msg.sender].id != 0);
        require(msg.value == tokenCount*TOKEN_PRICE);
        for(uint i = 0; i<tokenCount; i++){
            rp.safeMint(msg.sender);
        }
        users[msg.sender].balance += tokenCount;
        emit TokensPurchased(msg.sender, tokenCount);
    }
    
    function banUser(address userAddress) public onlyModerator {
        users[userAddress].banned = true;
        emit UserBanned(userAddress);
    }
    
    function unbanUser(address userAddress) public onlyModerator {
        users[userAddress].banned = false;
        emit UserUnbanned(userAddress);
    }
    
    // Functions for questions
    
    function askQuestion(string memory text, uint rewardPoints) public notBanned {
        require(rewardPoints <= users[msg.sender].balance, "You don't have enough tokens.");
        rp.safeTransfer(msg.sender, address(this), rewardPoints);
        users[msg.sender].balance -= rewardPoints;
        uint[] memory answerIds;
        questions[questionCounter] = Question(questionCounter, text, msg.sender, rewardPoints, answerIds, false);
        emit QuestionAsked(questionCounter, text, msg.sender);
        questionCounter++;
    }
    
    function resolveQuestion(uint questionId) public notBanned {
        require(questions[questionId].questioner == msg.sender, "You are not the questioner.");
        require(!questions[questionId].resolved, "Question is already resolved.");
        questions[questionId].resolved = true;
        uint rewardPoints = questions[questionId].reward;
        rp.safeTransfer(address(this), msg.sender, rewardPoints);
        users[answers[questions[questionId].answerIds[0]].answerer].balance += rewardPoints;
        emit QuestionResolved(questionId);
    }
    
    function upvoteQuestion(uint questionId) public notBanned {
        require(questionId < questionCounter, "Question doesn't exist.");
        users[questions[questionId].questioner].balance += 1;
    }
}