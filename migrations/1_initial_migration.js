const Migrations = artifacts.require("Migrations");
const RewardPoint = artifacts.require("RewardPoint")
const QAForum = artifacts.require("QAForum")


module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(RewardPoint);
  deployer.deploy(QAForum);
};
