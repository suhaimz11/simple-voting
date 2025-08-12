const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("SimpleVoting");
  const voting = await Voting.deploy(); // deploy the contract
  await voting.waitForDeployment(); // wait until it's deployed

  console.log("Voting contract deployed to:", voting.target); // use .target instead of .address in Ethers v6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
