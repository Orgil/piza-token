import { ethers, defender } from 'hardhat';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pizaTokenV2 = await ethers.getContractFactory('PizaToken');
  const proposal = await defender.proposeUpgradeWithApproval('<IMPLEMENTATION_ADDRESS>', pizaTokenV2);

  console.log(`Upgrade proposed with URL: ${proposal.url}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
