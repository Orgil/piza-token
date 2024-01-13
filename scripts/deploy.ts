import { ethers, defender } from 'hardhat';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pizaToken = await ethers.getContractFactory('PizaToken');
  const deployment = await defender.deployProxy(pizaToken, { initializer: 'initialize' });
  await deployment.waitForDeployment();

  console.log(`Contract deployed to ${await deployment.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
