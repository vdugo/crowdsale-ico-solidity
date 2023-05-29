const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) =>
{
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Crowdsale', () => 
{
    let crowdsale, token, accounts, deployer

    beforeEach(async () =>
    {
        const Crowdsale = await ethers.getContractFactory('Crowdsale')
        const Token = await ethers.getContractFactory('Token')

        token = await Token.deploy('Vince Coin', 'VIN', '1000000')

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]

        crowdsale = await Crowdsale.deploy(token.address)

        let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
        await transaction.wait()
    })

    describe('Deployment', () =>
    {
        it('sends tokens to the Crowdsale contract', async () =>
        {
            expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
        })

        it('returns correct address', async () =>
        {
            expect(await crowdsale.token()).to.equal(token.address)
        })
    })

    describe('Buying Tokens', () =>
    {
        let transaction, result
        let amount = tokens(10)

        describe('Success', () => 
        {
            beforeEach(async () =>
            {
                
            })

            it('transfers tokens', async () =>
            {
                transaction = await crowdsale.connect(user1).buyTokens(amount)
                result = await transaction.wait()

                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
                expect(await token.balanceOf(user1.address)).to.equal(amount)
            })
        })
    })
})
