const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) =>
{
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

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

        crowdsale = await Crowdsale.deploy(token.address, ether(1))

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
                transaction = await crowdsale.connect(user1).buyTokens(amount, {value: ether(10)})
                result = await transaction.wait()
            })

            it('transfers tokens', async () =>
            {
                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
                expect(await token.balanceOf(user1.address)).to.equal(amount)
            })

            it('updates contract ether balance', async () =>
            {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
            })
        })
    })
})
