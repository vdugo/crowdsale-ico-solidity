// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './Token.sol';

contract Crowdsale
{
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensSold;

    // Need Code
    // Need Address

    event Buy(uint256 amount, address buyer);

    constructor(Token _token, uint256 _price, uint256 _maxTokens)
    {
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
    }

    receive() external payable
    {
        uint256 amount = msg.value / price;
        // amount * 10^18
        buyTokens(amount * 1e18);
    }

    function buyTokens(uint256 _amount) public payable
    {
        require(msg.value == (_amount / 1e18) * price);
        // make sure this contract has enough tokens left to facilitate the sale
        require(token.balanceOf(address(this)) >= _amount);
        require(token.transfer(msg.sender, _amount), "failed to transfer tokens");

        tokensSold += _amount;

        emit Buy(_amount, msg.sender);
    }
}
