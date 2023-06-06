import { Container } from "react-bootstrap"
import { ethers } from "ethers"
import { useEffect, useState } from "react"

// Components
import Navigation from "./Navigation"
import Info from "./Info"
import Loading from "./Loading"
import Progress from "./Progress"
import Buy from "./Buy"

// ABIs
import TOKEN_ABI from '../abis/Token.json'
import CROWDSALE_ABI from '../abis/Crowdsale.json'

import config from '../config.json'

// local deployed on Hardhat contract addresses
const TOKEN_ADDRESS = config[31337].token.address
const CROWDSALE_ADDRESS = config[31337].crowdsale.address


function App()
{
    const [provider, setProvider] = useState(null)

    const [crowdsale, setCrowdsale] = useState(null)

    const [accountBalance, setAccountBalance] = useState(null)

    const [price, setPrice] = useState(0)
    const [maxTokens, setMaxTokens] = useState(0)
    const [tokensSold, setTokensSold] = useState(0)

    const [account, setAccount] = useState(null)

    const [isLoading, setIsLoading] = useState(true)

    const loadBlockchainData = async () =>
    {
        // initialize the provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        // initialize contracts
        const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider)
        console.log(token.address)

        const crowdsale = new ethers.Contract(CROWDSALE_ADDRESS, CROWDSALE_ABI, provider)
        console.log(crowdsale.address)
        setCrowdsale(crowdsale)

        // set account
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)

        const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
        setAccountBalance(accountBalance)

        // Introduce a delay of 1 second for testing purposes
        // with the loading spinner
        await new Promise(resolve => setTimeout(resolve, 1000));

        const price = ethers.utils.formatUnits(await crowdsale.price(), 18)
        setPrice(price)
        const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18)
        setMaxTokens(maxTokens)
        const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18)
        setTokensSold(tokensSold)

        setIsLoading(false)
    }

    useEffect(() =>
    {
        if (isLoading)
        {
            loadBlockchainData()
        }
    }, [isLoading])

    return(
        <Container>
            <Navigation />

            <h1 className="my-4 text-center">Introducing VIN token</h1>

            {isLoading ? 
            (
                <Loading />
            )
            :
            (
                <>
                    <p className="text-center"><strong>Current price: {price} ETH</strong></p>
                    <Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} />
                    <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
                </>
                
            )
            }
            <hr />
            {
                account &&
                (
                    <Info account={account} accountBalance={accountBalance} />
                )
            }
        </Container>
    )
}

export default App
