# Piza Token Project

### Blacklist

**Preventing Abuse**: If a user or an address engages in abusive or unwanted behavior (such as spamming or executing harmful transactions), blacklisting can block these actors from using the contract.
**Enhancing Security**: Blacklisting addresses known to be sources of fraudulent activities or associated with security threats can prevent potential damage.
**Compliance and Sanctions**: For legal compliance, addresses from certain geographic regions or entities might need to be blocked from interacting with the contract.

### Pausable Function
**Emergency Stops**: In case there is a discovery of a critical bug or a security vulnerability, pausing the smart contract can prevent further damage by stopping all activity while a solution is developed and deployed.
**Upgrades and Maintenance**: If the contract needs to be upgraded or undergo maintenance, pausing can help ensure that no transactions occur that could conflict with the updates.
**Regulatory Compliance**: Sometimes, compliance with legal or regulatory changes may require temporarily halting operations until the contract can be adjusted to meet new requirements.

#### Development

Deployment Node: Infura

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
