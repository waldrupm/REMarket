// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
// var ERC721MintableComplete = artifacts.require("./ERC721MintableComplete.sol");

module.exports = function(deployer) {
  deployer.deploy(SquareVerifier).then(function() {
    return deployer.deploy(SolnSquareVerifier, SquareVerifier.address, "MikeERC721Token", "ME721");
  });
  // deployer.deploy(ERC721MintableComplete, "MikeERC721Token", "ME721")
};
