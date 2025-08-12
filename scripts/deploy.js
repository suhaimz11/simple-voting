const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("SimpleVoting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();  // <-- here

  console.log("Voting contract deployed to:", voting.target);  // `voting.target` contains address in ethers v6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
