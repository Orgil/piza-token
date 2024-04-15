// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import './Blacklistable.sol';

/**
 * @title An ERC20 token contract named Piza
 * @author Orgil
 * @notice Serves as a fungible utility token
 * @dev Inherits the OpenZepplin ERC20, ERC20Burnable, ERC20Pausable implentations
 */
contract PizaToken is ERC20, ERC20Burnable, ERC20Pausable, Blacklistable {
  /**
   * @notice Deploys the smart contract and creates 5000000000 tokens
   * @dev Assigns `contractOwner` to the owner state variable
   * @param contractOwner The owner of the deployed token contract
   * @param tokenOwner The amount of tokens `tokenOwner` will receive
   */
  constructor(address contractOwner, address tokenOwner) ERC20('Piza Token', 'PIZA') Ownable(contractOwner) {
    _mint(tokenOwner, 5000000000 * 10 ** decimals());
  }

  /**
   * @notice Owner of the contract can pause the all trades
   * @dev Owner of the contract can pause the all trades
   */
  function pause() public onlyOwner {
    _pause();
  }

  /**
   * @notice Owner of the contract can pause the all trades
   * @dev Owner of the contract can pause the all trades
   */
  function unpause() public onlyOwner {
    _unpause();
  }

  /**
   * @dev The following functions are overrides required by Solidity.
   */
  function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
    super._update(from, to, value);
  }

  /**
   * @notice Transfer tokens to address
   * @dev Overrides transfer function to check blacklist before transfer occurs
   * @param to address The address which you want to transfer to
   * @param amount uint256 the amount of tokens to be transferred
   */
  function transfer(
    address to,
    uint amount
  ) public override notBlacklisted(msg.sender) notBlacklisted(to) returns (bool) {
    return super.transfer(to, amount);
  }

  /**
   * @notice Transfer tokens from one address to another
   * @dev Overrides transferFrom function to check blacklist before transfer occurs
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param amount uint256 the amount of tokens to be transferred
   */
  function transferFrom(
    address from,
    address to,
    uint amount
  ) public override notBlacklisted(from) notBlacklisted(to) returns (bool) {
    return super.transferFrom(from, to, amount);
  }

  /**
   * @notice Burn token from caller address
   * @dev Overrides transferFrom function to check blacklist before transfer occurs
   * @param amount uint256 the amount of tokens to be transferred
   */
  function burn(uint256 amount) public override(ERC20Burnable) notBlacklisted(msg.sender) {
    super._burn(msg.sender, amount);
  }

  /**
   * @notice Burn tokens from allowed address
   * @dev Overrides transferFrom function to check blacklist before transfer occurs
   * @param from address The address which you want to send tokens from
   * @param amount uint256 the amount of tokens to be transferred
   */
  function burnFrom(
    address from,
    uint amount
  ) public override(ERC20Burnable) notBlacklisted(msg.sender) notBlacklisted(from) {
    super._burn(from, amount);
  }
}
