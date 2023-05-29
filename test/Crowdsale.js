const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) =>
{
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Crowdsale', () => 
{
    let Crowdsale
    let crowdsale

    beforeEach(async () =>
    {

    })

    describe('Deployment', () =>
    {
        it('has correct name', async () =>
        {
            Crowdsale = await ethers.getContractFactory('Crowdsale')
            crowdsale = await Crowdsale.deploy()
            expect(await crowdsale.name()).to.equal('Crowdsale')
        })
    })
})
