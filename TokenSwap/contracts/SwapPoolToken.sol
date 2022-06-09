pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapPoolToken is ERC20 {
    uint256 public _amount0;
    uint256 public _amount1;

    uint256 _feeToken0;
    uint256 _feeToken1;

    address public _owner;

    address public _token0;
    address public _token1;

    constructor(address token0, address token1) ERC20("SwapPoolToken", "SPT") {
        _token0 = token0;
        _token1 = token1;
        _owner = msg.sender;
    }

    function swap(uint256 amount0, uint256 amount1) public {
        uint256 amount0Mut = amount0;
        uint256 amount1Mut = amount1;
        // uint256 normalizedAmount0 = amount0 * (10**18);
        // uint256 normalizedAmount1 = amount1 * (10**18);

        uint256 feeToken0 = (amount0 * 3) / 1000;
        uint256 feeToken1 = (amount1 * 3) / 1000;

        if (
            ((_amount0 * (10**2)) / _amount1) == ((amount0 * (10**2)) / amount1)
        ) {
            amount0Mut -= feeToken0;
            amount1Mut -= feeToken1;

            _amount0 += amount0Mut;
            _amount1 -= amount1Mut;

            _feeToken0 += feeToken0;
            _feeToken1 += feeToken1;

            IERC20(_token0).transferFrom(msg.sender, address(this), amount0); //reentrancy attack
            IERC20(_token1).transfer(msg.sender, amount1Mut);
        }
    }

    function swapNormalized(uint256 amount0, uint256 amount1) public {
        uint256 normalizedAmount0 = amount0 * (10**18);
        uint256 normalizedAmount1 = amount1 * (10**18);

        uint256 feeToken0 = (normalizedAmount0 * 3) / 10;
        uint256 feeToken1 = (normalizedAmount1 * 3) / 10;

        if (
            (((_amount0 * (10**18)) / _amount1) * (10**18)) ==
            (((normalizedAmount0 * (10**18)) / normalizedAmount1) * (10**18))
        ) {
            normalizedAmount0 -= feeToken0;
            normalizedAmount1 -= feeToken1;

            _amount0 += normalizedAmount0;
            _amount1 -= normalizedAmount1;

            _feeToken0 += feeToken0;
            _feeToken1 += feeToken1;

            IERC20(_token0).transferFrom(
                msg.sender,
                address(this),
                normalizedAmount0
            ); //reentrancy attack
            IERC20(_token1).transferFrom(
                address(this),
                msg.sender,
                normalizedAmount1
            );
        }
    }

    //if account has amount of tokens, transfer them to adress of the contract
    //based on the amount, transfer liquidity to account
    function addLiquidity(uint256 amount0, uint256 amount1) public {
        // uint256 normalizedAmount0 = amount0 * (10**18);
        // uint256 normalizedAmount1 = amount1 * (10**18);

        _amount0 += amount0;
        _amount1 += amount1;

        uint256 lpAmount = (amount0 * amount1);
        _mint(msg.sender, lpAmount);

        require(
            IERC20(_token0).allowance(msg.sender, address(this)) >= amount0,
            "Insufficient allowance token0"
        );
        require(
            IERC20(_token1).allowance(msg.sender, address(this)) >= amount1,
            "Insufficient allowance token1"
        );

        IERC20(_token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(_token1).transferFrom(msg.sender, address(this), amount1);
    }

    function removeLiquidity(uint256 liquidity) public {
        uint256 _liquidity = (_amount0 * _amount1);
        uint256 ratio = (liquidity * (10**2)) / (_liquidity);

        uint256 amount0 = (_amount0 * ratio) / (10**2);
        uint256 amount1 = (_amount1 * ratio) / (10**2);

        _amount0 -= amount0;
        _amount1 -= amount1;

        uint256 feeAmount0 = (_feeToken0 * ratio) / (10**2);
        uint256 feeAmount1 = (_feeToken1 * ratio) / (10**2);

        _feeToken0 -= feeAmount0;
        _feeToken1 -= feeAmount1;

        amount0 += feeAmount0;
        amount1 += feeAmount1;

        _burn(msg.sender, liquidity);

        IERC20(_token0).transfer(msg.sender, amount0);
        IERC20(_token1).transfer(msg.sender, amount1);
    }
    /* not used in this case
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
    */
}
