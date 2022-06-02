pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SwapPoolToken is ERC20 {
    uint256 _amount0;
    uint256 _amount1;
    address _lpToken;
    address public owner;

    address _token0;
    address _token1;

    constructor(
        address token0,
        address token1,
        address lpToken
    ) ERC20("SwapPoolToken", "SPT") {
        _token0 = token0;
        _token1 = token1;
        _lpToken = lpToken;
        owner = msg.sender;
    }

    function swap(uint256 amount0, uint256 amount1) public {
        uint256 normalizedAmount0 = amount0 * (10**18);
        uint256 normalizedAmount1 = amount1 * (10**18);

        if (
            (((_amount0 * (10**18)) / _amount1) * (10**18)) ==
            (((normalizedAmount0 * (10**18)) / normalizedAmount1) * (10**18))
        ) {
            //calculate fees
            _amount0 += normalizedAmount0;
            _amount1 -= normalizedAmount1;

            IERC20(_token0).transferFrom(msg.sender, owner, normalizedAmount0); //reentrancy attack
            IERC20(_token1).transferFrom(owner, msg.sender, normalizedAmount1);
        }
    }

    //if account has amount of tokens, transfer them to adress of the contract
    //based on the amount, transfer liquidity to account
    function addLiquidity(
        address account,
        uint256 amount0,
        uint256 amount1
    ) public {
        uint256 normalizedAmount0 = amount0 * (10**18);
        uint256 normalizedAmount1 = amount1 * (10**18);

        _amount0 += normalizedAmount0;
        _amount1 += normalizedAmount1;

        uint256 lpAmount = sqrt(normalizedAmount0 * normalizedAmount1);
        _mint(account, lpAmount);

        IERC20(_token0).transferFrom(account, address(this), normalizedAmount0);
        IERC20(_token1).transferFrom(account, address(this), normalizedAmount1);
    }

    function removeLiquidity(address account, uint256 liquidity) public {
        uint256 _liquidity = sqrt(_amount0 * _amount1);
        uint256 ratio = (liquidity * (10**18)) / (_liquidity * (10**18));

        uint256 amount0 = _amount0 * ratio;
        uint256 amount1 = _amount1 * ratio;

        _amount0 -= amount0;
        _amount1 -= amount1;

        _burn(account, liquidity);
        IERC20(_token0).transferFrom(address(this), account, amount0);
        IERC20(_token1).transferFrom(address(this), account, amount1);
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
