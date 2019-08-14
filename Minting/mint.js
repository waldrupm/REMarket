const HDWalletProvider = require("truffle-hdwallet-provider")
const fs = require('fs');
const web3 = require('web3')
const MNEMONIC = fs.readFileSync('../eth-contracts/.secret').toString().trim();
const INFURA_KEY = fs.readFileSync('../eth-contracts/.infuraEndpoint').toString().trim();
const NFT_CONTRACT_ADDRESS = "0x689b5c09eED7b7c040487b8b93697CaD2022E516";
const OWNER_ADDRESS = "0x96E8493e45a2576df3d3e16688449298C9682C13";
const NETWORK = 'rinkeby';

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const NFT_JSON = require("../eth-contracts/build/contracts/SolnSquareVerifier.json");
const NFT_ABI = NFT_JSON.abi;


async function addSolutions(coinNumber) {
  // console.log(nftContract);
  // Add solutions for minting then mint
  let result;
  const provider = new HDWalletProvider(MNEMONIC, INFURA_KEY);
  const web3Instance = new web3(provider);
  const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" });
  nftContract.options.from = OWNER_ADDRESS;
        try {
          let currentProofJson = require(`../zokrates/Coin${coinNumber}-${coinNumber*coinNumber}/proof.json`);
          let coinProof = buildProof(currentProofJson);
          // console.log(coinProof);
          console.log(`Trying to add solution for Coin ${coinNumber}`);
          result = await nftContract.methods.addSolution(coinProof.proof.a, coinProof.proof.b, coinProof.proof.c, coinProof.inputs);
        
        } catch(e) {
          console.log(e);
        }
        console.log("Solution was added for coin ", coinNumber , result.transactionHash);
};
// async function mintTenTokens() {
//   // console.log(nftContract);
//   // Add solutions for minting then mint
//   for (let s = 1; s < 11; s++) {
//     try {
//       let currentProofJson = require(`../zokrates/Coin${s}-${s*s}/proof.json`);
//       let coinProof = buildProof(currentProofJson);
//       console.log(`Trying to mint coin ${s} for ${OWNER_ADDRESS}`);
//       let minting = await nftContract.mintNewNFT(coinProof.inputs[0], coinProof.inputs[1], OWNER_ADDRESS);
//       console.log("Minting of token ", s, " was done", minting.transactionHash);
    
//     } catch(e) {
//       console.log(e);
//     }
//   } 
// };


const buildProof = function(jsonProof) {
  // console.log(jsonProof.proof);
  return  {
    "proof": {
      "a": [jsonProof.proof.a[0], jsonProof.proof.a[1]],
      "b": [[jsonProof.proof.b[0][0], jsonProof.proof.b[0][1]],
            [jsonProof.proof.b[1][0], jsonProof.proof.b[1][1]]],
      "c": [jsonProof.proof.c[0], jsonProof.proof.c[1]]
    },
    "inputs": jsonProof.inputs
  };
};

addSolutions(1);