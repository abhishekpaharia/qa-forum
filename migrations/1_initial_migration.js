const Migrations = artifacts.require("Migrations");
const TodoList = artifacts.require("TodoList")
const RewardPoint = artifacts.require("RewardPoint")
const QAForum = artifacts.require("QAForum")


module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(TodoList);
  deployer.deploy(RewardPoint);
  deployer.deploy(QAForum);
};
