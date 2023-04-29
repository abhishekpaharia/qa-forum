// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./RewardPoint.sol";
contract QAForum {

    // Define the structure for questions
    struct Question {
        uint id;
        string title;
        string text;
        address questioner;
        uint reward;
        uint [] answerIds;
        bool resolved;
    }
    
    // Define the structure for answers
    struct Answer {
        uint id;
        string text;
        address answerer;
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
    uint public questionCounter = 1;
    uint public userCounter = 1;
    uint public answerCounter = 1;
    mapping(uint => Question) public questions;
    mapping(address => User) public users;
    mapping(uint => Answer) public answers;
    uint public constant TOKEN_PRICE = 1e18 wei;
    RewardPoint public  rp;
    address public owner;
    
    // Define events
    event UserRegistered(uint indexed id, string username, uint balance);
    event QuestionAsked(uint indexed questionId, string text, address questioner);
    event AnswerGiven(uint indexed answerId, string text, address answerer);
    event QuestionResolved(uint indexed questionId);
    event AnswerAccepted(uint indexed answerId, uint indexed questionId);
    event UserBanned(address user);
    event UserUnbanned(address user);
    event TokensPurchased(address indexed user, uint amount, uint updatedBalance);
    event BalanceUpdate(address indexed user, uint updatedBalance);
    
    
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
        
        users[msg.sender] = User(userCounter, username, 0, false);
        userCounter++;
        emit UserRegistered(userCounter, username, 0);
    }
    
    function purchaseTokens(uint tokenCount) public payable {
        require(users[msg.sender].id != 0);
        require(msg.value == tokenCount*TOKEN_PRICE);
        for(uint i = 0; i<tokenCount; i++){
            rp.safeMint(msg.sender);
        }
        users[msg.sender].balance += tokenCount;
        //emit TokensPurchased(msg.sender, tokenCount, users[msg.sender].balance);
        emit BalanceUpdate(msg.sender, users[msg.sender].balance);
    }
    
    
    // Functions for questions
    
    function askQuestion(string calldata title, string calldata text, uint rewardPoints) public returns(uint){
        require(rewardPoints <= users[msg.sender].balance, "You don't have enough tokens.");
        rp.safeTransfer(msg.sender, address(this), rewardPoints);
        users[msg.sender].balance -= rewardPoints;
        uint [] memory answerIds;
        // // uint[] memory arr2 = new uint[](newArrLength);
        questions[questionCounter] = Question(questionCounter, title, text, msg.sender, rewardPoints, answerIds, false);
        questions[questionCounter].answerIds.push(1);
        emit QuestionAsked(questionCounter, text, msg.sender);
        questionCounter++;
        emit BalanceUpdate(msg.sender, users[msg.sender].balance);
        return questionCounter -1;
    }
    
    function resolveQuestion(uint questionId, uint anwserId) public {
        require(questions[questionId].questioner == msg.sender, "You are not the questioner.");
        require(!questions[questionId].resolved, "Question is already resolved.");
        uint rewardPoints = questions[questionId].reward;

        Answer memory ans = answers[anwserId];
        address answerer = ans.answerer;
        ans.accepted = true;
        questions[questionId].resolved = true;

        rp.safeTransfer(address(this), answerer, rewardPoints);
        users[answerer].balance += rewardPoints;

        //emit QuestionResolved(questionId);
        emit BalanceUpdate(answerer, users[answerer].balance);
    }

    function postAnswer(uint questionId, string memory text) public {
        require(questions[questionId].resolved == false, "question already resolved");
        require(questions[questionId].questioner != msg.sender, "can't answer your own question");
        answers[answerCounter] = Answer(answerCounter, text, msg.sender, false);
        questions[questionId].answerIds.push(answerCounter);
        answerCounter++;
        
    }
    
}