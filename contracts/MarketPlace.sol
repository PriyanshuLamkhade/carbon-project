// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./C2Token.sol";
import "@openzeppelin/contracts@5.0.0/utils/ReentrancyGuard.sol";

contract C2Marketplace is ReentrancyGuard {
    C2Token public token;

    struct Listing {
        address seller;
        uint256 amount;
        uint256 pricePerToken; // in wei
        bool active;
    }

    uint256 public listingId;
    mapping(uint256 => Listing) public listings;

    // 🔔 EVENTS
    event Listed(uint256 id, address seller, uint256 amount, uint256 price);
    event Purchased(uint256 id, address buyer, uint256 amount);
    event Cancelled(uint256 id);

    constructor(address tokenAddress) {
        token = C2Token(tokenAddress);
    }

    // 🔹 List tokens
    function listTokens(uint256 amount, uint256 pricePerToken) public {
        require(amount > 0, "Amount must be > 0");
        require(pricePerToken > 0, "Price must be > 0");
        require(token.balanceOf(msg.sender) >= amount, "Not enough tokens");

        // Transfer tokens to marketplace (escrow)
        token.transferFrom(msg.sender, address(this), amount);

        listingId++;

        listings[listingId] = Listing({
            seller: msg.sender,
            amount: amount,
            pricePerToken: pricePerToken,
            active: true
        });

        emit Listed(listingId, msg.sender, amount, pricePerToken);
    }

    // 🔹 Buy tokens
    function buy(uint256 id, uint256 amount) public payable nonReentrant {
        Listing storage listing = listings[id];

        require(listing.active, "Listing inactive");
        require(amount > 0, "Invalid amount");
        require(listing.amount >= amount, "Not enough tokens");

        uint256 totalPrice = (amount * listing.pricePerToken) / 1e18;
        require(msg.value == totalPrice, "Incorrect ETH sent");

        // ✅ EFFECTS first
        listing.amount -= amount;

        if (listing.amount == 0) {
            listing.active = false;
        }

        // ✅ INTERACTIONS after
        payable(listing.seller).transfer(msg.value);
        token.transfer(msg.sender, amount);

        emit Purchased(id, msg.sender, amount);
    }

    // 🔹 Cancel listing
    function cancelListing(uint256 id) public {
        Listing storage listing = listings[id];

        require(listing.active, "Already inactive");
        require(msg.sender == listing.seller, "Not seller");

        uint256 remaining = listing.amount;

        listing.amount = 0;
        listing.active = false;

        token.transfer(listing.seller, remaining);

        emit Cancelled(id);
    }
}