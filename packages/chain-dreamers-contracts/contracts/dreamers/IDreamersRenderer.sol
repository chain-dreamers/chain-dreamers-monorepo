// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IDreamersRenderer {
    function getSvg(uint256 tokenId) external view returns (string memory);
}
