const hre = require("hardhat");

async function main() {
  const candidates = ["Alice", "Bob", "Charlie"];  // Customize candidates here

  const Voting = await hre.ethers.getContractFactory("SimpleVoting");
  const voting = await Voting.deploy(candidates);
  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", voting.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
