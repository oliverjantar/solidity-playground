pragma solidity ^0.8.0;


import 'https://github.com/Uniswap/v2-core/blob/master/contracts/libraries/Math.sol';

contract SwapPool {

    using SafeMath  for uint;

    uint _amount0;
    uint _amount1;
    address _lpToken;

    address _token0;
    address _token1;

    constructor(address token0, address token1, address lpToken){
        _token0 = token0;
        _token1 = token1;
        _lpToken = lpToken;
    }

    function swap(uint256 amount0, uint256 amount1, address to) public{
//  (amount0 /amount1) * 10^18

        //jestli to odpovida te cene _amount0/_amount1
    }

    function addLiquidity(address account, uint256 amount0, uint256 amount1) public{

        // uint balance0 = IERC20(_token0).balanceOf(account);
        // uint balance1 = IERC20(_token1).balanceOf(account);
        // require(balance0>= amount0 && balance1 >= amount1);

        IERC20(token0).transferFrom(account, this, amount0);
        IERC20(token1).transferFrom(account, this, amount1);

        //if account has amount of tokens, transfer them to this
        //based on the amount, transfer liquidity to address

        uint lpAmount = Math.sqrt(uint(amount0).mul(amount1));

        IERC20(_lpToken)._mint(account,lpAmount);
    }

    function removeLiquidity(address account, uint256 liquidity) public {
        //if account has that liquidity, burn the liquidity 
        //calculate amount0 and amount1 based on the liquidity
        //and transfer amount0 and amount1 to account
    }
}