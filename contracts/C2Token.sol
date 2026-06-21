// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract C2Token is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event Retired(address indexed user, uint256 amount, string reason);

    constructor() ERC20("C2 Token", "C2") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // 🔹 Mint after project approval → directly to landowner
    function mintToLandowner(address landowner, uint256 amount)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(landowner, amount);
    }

    // 🔹 Buyer retires (burns) token
    function retire(uint256 amount, string memory reason) public {
        _burn(msg.sender, amount);
        emit Retired(msg.sender, amount, reason);
    }
}