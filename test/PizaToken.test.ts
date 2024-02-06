// SPDX-License-Identifier: MIT
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { PizaToken } from '../typechain-types';
import { ContractRunner } from 'ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

const fixture = async () => {
  const [contractOwner, tokenOwner, recipient, approved] = await ethers.getSigners();

  const deployment = await ethers.deployContract('PizaToken', [contractOwner, tokenOwner]);
  await deployment.waitForDeployment();
  return { contractOwner, tokenOwner, recipient, approved, deployment };
};

let g: {
  contractOwner: ContractRunner;
  tokenOwner: HardhatEthersSigner;
  recipient: HardhatEthersSigner;
  approved: HardhatEthersSigner;
  deployment: PizaToken;
};

describe('Piza Token', () => {
  beforeEach(async () => {
    g = await loadFixture(fixture);
  });

  it('Deployment should mint the total supply of tokens to the token owner', async function () {
    const ownerBalance = await g.deployment.balanceOf(g.tokenOwner.address);
    expect(await g.deployment.totalSupply()).to.equal(ownerBalance);
  });

  describe('blacklist', () => {
    it('account is blacklisted', async () => {
      await g.deployment.addToBlacklist(g.recipient);
      expect(await g.deployment.connect(g.tokenOwner).isBlacklisted(g.recipient)).to.be.true;
    });

    it('only owner add or remove account from blacklist', async () => {
      await g.deployment.connect(g.contractOwner).addToBlacklist(g.recipient);
      expect(await g.deployment.connect(g.tokenOwner).isBlacklisted(g.recipient)).to.be.true;

      await g.deployment.connect(g.contractOwner).removeFromBlacklist(g.recipient);
      expect(await g.deployment.connect(g.tokenOwner).isBlacklisted(g.recipient)).to.be.false;
    });

    it('revert blacklist actions if not owner', async () => {
      await expect(g.deployment.connect(g.recipient).addToBlacklist(g.tokenOwner))
        .to.be.revertedWithCustomError(g.deployment, 'OwnableUnauthorizedAccount')
        .withArgs(g.recipient);
    });

    it('account is not blacklisted', async () => {
      expect(await g.deployment.connect(g.tokenOwner).isBlacklisted(g.recipient)).to.be.false;
    });

    it('account is not blacklisted after remove from blacklist', async () => {
      await g.deployment.addToBlacklist(g.recipient);
      await g.deployment.removeFromBlacklist(g.recipient);

      expect(await g.deployment.connect(g.tokenOwner).isBlacklisted(g.recipient)).to.be.false;
    });
  });

  describe('transfer', () => {
    const transfer = 100n;

    it('allow transfer', async () => {
      await expect(g.deployment.connect(g.tokenOwner).transfer(g.recipient, transfer)).to.changeTokenBalances(
        g.deployment,
        [g.tokenOwner, g.recipient],
        [-transfer, transfer]
      );
    });

    it('reverts transfer FROM blacklisted account', async () => {
      await g.deployment.addToBlacklist(g.tokenOwner);

      await expect(g.deployment.connect(g.tokenOwner).transfer(g.recipient, transfer)).to.be.revertedWith(
        'Address is blacklisted'
      );
    });

    it('reverts transfer TO blacklisted account', async () => {
      await g.deployment.addToBlacklist(g.recipient);

      await expect(g.deployment.connect(g.tokenOwner).transfer(g.recipient, transfer)).to.be.revertedWith(
        'Address is blacklisted'
      );
    });
  });

  describe('transferFrom', () => {
    const allowance = 100n;

    beforeEach(async function () {
      await g.deployment.connect(g.tokenOwner).approve(g.approved, allowance);
    });

    it('allow transferFrom', async () => {
      await expect(
        g.deployment.connect(g.approved).transferFrom(g.tokenOwner, g.recipient, allowance)
      ).to.changeTokenBalances(g.deployment, [g.tokenOwner, g.recipient], [-allowance, allowance]);
    });

    it('reverts transferFrom FROM blacklisted account', async () => {
      await g.deployment.addToBlacklist(g.tokenOwner);

      await expect(
        g.deployment.connect(g.approved).transferFrom(g.tokenOwner, g.recipient, allowance)
      ).to.be.revertedWith('Address is blacklisted');
    });

    it('reverts transferFrom TO blacklisted account', async () => {
      await g.deployment.addToBlacklist(g.recipient);

      await expect(
        g.deployment.connect(g.approved).transferFrom(g.tokenOwner, g.recipient, allowance)
      ).to.be.revertedWith('Address is blacklisted');
    });
  });
});
