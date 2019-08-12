var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    // Token properties
    const name = "MikeERC721Token";
    const symbol = "ME721";
    const baseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone";

    // Testing utility props
    const defAddress = "0x0000000000000000000000000000000000000000";
    let contractOwner;
    let contractObj;

    describe('Ownable functionality', () => {
        beforeEach(async function() {
            contractObj = await ERC721MintableComplete.new(name, symbol, {from: account_one});
        })

        it('should give owner address', () => {
            let owner = await contractObj.owner({from: account_two});
            assert.equal(owner, account_one, "Owner is not shown as account one");
        });

        it('should only allow owner to change contract ownership', async () => {
            let owner = await contractObj.owner({from: account_two});
            await contractObj.transferOwnership(account_two, {from: account_two});
            let ownerAfter = await contractObj.owner({from: account_two});
            assert.equal(owner, ownerAfter, "Owner was changed by non owner");
        });

        it('should change owner when conditions met', () => {
            let owner = await contractObj.owner({from: account_two});
            await contractObj.transferOwnership(account_two, {from: account_one});
            let ownerAfter = await contractObj.owner({from: account_two});
            assert.equal(account_two, ownerAfter, "Owner was not changed by valid transfer");
        });
    })
    

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            contractObj = await ERC721MintableComplete.new(name, symbol,{from: account_one});

            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () { 
            
        })

        it('should get token balance', async function () { 
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            
        })

        it('should transfer token from one owner to another', async function () { 
            
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
        })

        it('should return contract owner', async function () { 
            
        })

    });
})