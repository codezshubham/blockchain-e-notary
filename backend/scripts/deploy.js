import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();

  const ENotary = await ethers.getContractFactory("ENotary");
  const eNotary = await ENotary.deploy();

  await eNotary.waitForDeployment();

  console.log("ENotary deployed to:", await eNotary.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});