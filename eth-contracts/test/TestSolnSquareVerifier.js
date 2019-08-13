const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

const verifierContract = artifacts.require('Verifier');
const solnVerifierContract = artifacts.require('SolnSquareVerifier');

const jsonProof = require('../../zokrates/Coin3-9/proof.json');
let admin;
let coinProof;
let solnInstance;
let coinName = "MikeERC721Token";
let coinSymbol = "ME721";

contract('SolnSquareVerifier', accounts => {

  before(async () => {
    admin = accounts[0];
    coinProof = buildProof(); 
    const verifier = await verifierContract.new({from: admin});
    solnInstance = await solnVerifierContract.new(verifier.address, coinName, coinSymbol, {from: admin});
  });

  it('should not add a solution that is invalid', async () => {
    await expectToRevert(solnInstance.addSolution(coinProof.proof.a, coinProof.proof.b, coinProof.proof.c, [4,1]),
                          'Solution could not be verified');
  });

  it('should add solution when valid and send SolutionAdded event', async () => {
    let tx = await solnInstance.addSolution(coinProof.proof.a, coinProof.proof.b, coinProof.proof.c, coinProof.inputs, {from: admin});
    truffleAssert.eventEmitted(tx, 'SolutionAdded', (event) => {
      return expect(Number(event.solutionIndex)).to.equal(0) && expect(event.solutionAddress).to.equal(admin);
    })
  });

  it('should not mint token if solution not added', async () => {
    await expectToRevert(solnInstance.mintNewNFT(2,4,accounts[1],{from: admin}), "Solution does not exist");
  });

  
  it('should not mint token if solution owner is not current sender', async () => {
    await expectToRevert(solnInstance.mintNewNFT(9, 1, accounts[2],{from: accounts[2]}), "Only solution address can use it to mint a token");
  });
  
  it('should mint token with valid solution and correct account - emit event', async () => {
    let tx = await solnInstance.mintNewNFT(9, 1, admin, {from: admin});
    truffleAssert.eventEmitted(tx, 'Transfer', (event) => {
      return expect(event.from).to.equal("0x0000000000000000000000000000000000000000") &&
              expect(event.to).to.equal(admin) &&
              expect(Number(event.tokenId)).to.equal(0);
    });
  });
  
  it('should not mint token if that token is already minted for that solution', async () => {
    await expectToRevert(solnInstance.mintNewNFT(9,1,admin, {from: admin}), "Token already minted for this solution");
  });

});

const buildProof = function() {
  return  {
    "proof": {
      "a": [web3.utils.toBN(jsonProof.proof.a[0]).toString(), web3.utils.toBN(jsonProof.proof.a[1]).toString()],
      "b": [[web3.utils.toBN(jsonProof.proof.b[0][0]).toString(), web3.utils.toBN(jsonProof.proof.b[0][1]).toString()],
            [web3.utils.toBN(jsonProof.proof.b[1][0]).toString(), web3.utils.toBN(jsonProof.proof.b[1][1]).toString()]],
      "c": [web3.utils.toBN(jsonProof.proof.c[0]).toString(), web3.utils.toBN(jsonProof.proof.c[1]).toString()]
    },
    "inputs": jsonProof.inputs
  };
};

const expectToRevert = (promise, errorMessage) => {
  return truffleAssert.reverts(promise, errorMessage);
};
// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier