// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';

abstract contract Blacklistable is Ownable {
  mapping(address => bool) internal blacklist;

  event AddedToBlacklist(address indexed _account);
  event RemovedFromBlacklist(address indexed _account);

  modifier notBlacklisted(address _account) {
    require(blacklist[_account] == false, 'Address is blacklisted');
    _;
  }

  function isBlacklisted(address _account) external view returns (bool) {
    return blacklist[_account];
  }

  function addToBlacklist(address _account) external onlyOwner {
    blacklist[_account] = true;
    emit AddedToBlacklist(_account);
  }

  function removeFromBlacklist(address _account) external onlyOwner {
    blacklist[_account] = false;
    emit RemovedFromBlacklist(_account);
  }
}
