// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Thin wrapper around snarkjs-exported Groth16 verifiers for DApp integration.
contract CredentialVerifier {
    address public immutable isAdultVerifier;
    address public immutable isBalanceAboveVerifier;

    event AdultVerified(address indexed user, uint256 currentYear);
    event BalanceVerified(address indexed user, uint256 threshold);

    constructor(address _isAdultVerifier, address _isBalanceAboveVerifier) {
        isAdultVerifier = _isAdultVerifier;
        isBalanceAboveVerifier = _isBalanceAboveVerifier;
    }

    function verifyAdult(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata pubSignals
    ) external returns (bool) {
        bool ok = IIsAdultVerifier(isAdultVerifier).verifyProof(a, b, c, pubSignals);
        require(ok, "Invalid adult proof");
        require(pubSignals[0] == 1, "Not an adult");
        emit AdultVerified(msg.sender, pubSignals[1]);
        return true;
    }

    function verifyBalance(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata pubSignals
    ) external returns (bool) {
        bool ok = IIsBalanceAboveVerifier(isBalanceAboveVerifier).verifyProof(a, b, c, pubSignals);
        require(ok, "Invalid balance proof");
        require(pubSignals[0] == 1, "Balance not above threshold");
        emit BalanceVerified(msg.sender, pubSignals[1]);
        return true;
    }
}

interface IIsAdultVerifier {
    function verifyProof(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata pubSignals
    ) external view returns (bool);
}

interface IIsBalanceAboveVerifier {
    function verifyProof(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata pubSignals
    ) external view returns (bool);
}
