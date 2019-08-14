const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const MNEMONIC = "[REMOVED]";
const INFURA_ENDPOINT = "https://rinkeby.infura.io/v3/[REMOVED]";
const NFT_CONTRACT_ADDRESS = "0x3e861972AE50fcCd47EBc354909aef73110569EE";
const OWNER_ADDRESS = "0x96E8493e45a2576df3d3e16688449298C9682C13";
const NETWORK = "rinkeby";


const NFT_JSON = require('../eth-contracts/build/contracts/SolnSquareVerifier.json');
const NFT_ABI = NFT_JSON.abi;



async function main() {
    const provider = new HDWalletProvider(MNEMONIC, INFURA_ENDPOINT)
    const web3Instance = new web3(
        provider
    )

    if (NFT_CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" })

        // Creatures issued directly to the owner.
        try {
          for (let i = 1; i < 10; i++) {
            let tx = await nftContract.methods.mint(OWNER_ADDRESS, i).send({from: OWNER_ADDRESS});
            console.log(tx);
          }

        } catch (e) {
          console.log(e);
        }
            // const result = await nftContract.methods.mintTo(OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
            // console.log("Minted creature. Transaction: " + result.transactionHash)
    }
}

main()