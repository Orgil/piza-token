// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol';
import './Blacklistable.sol';

contract PizaToken is ERC20, ERC20Pausable, Blacklistable {
  constructor(address contractOwner, address tokenOwner) ERC20('Piza Token', 'PIZA') Ownable(contractOwner) {
    _mint(tokenOwner, 5000000000 * 10 ** decimals());
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  // The following functions are overrides required by Solidity.
  function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
    super._update(from, to, value);
  }

  function transfer(
    address to,
    uint amount
  ) public override notBlacklisted(msg.sender) notBlacklisted(to) returns (bool) {
    return super.transfer(to, amount);
  }

  function transferFrom(
    address from,
    address to,
    uint amount
  ) public override notBlacklisted(from) notBlacklisted(to) returns (bool) {
    return super.transferFrom(from, to, amount);
  }
}
