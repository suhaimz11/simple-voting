const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();

  const votingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Voting = await ethers.getContractFactory("SimpleVoting");
  const voting = Voting.attach(votingAddress).connect(signers[0]); // Use first signer as admin

  try {
    const endTx = await voting.endVoting();
    await endTx.wait();
    console.log("✅ Voting ended.");
  } catch (err) {
    console.error("Failed to end voting:", err.reason || err.message);
    return;
  }

  // Fetch and display results
  const [candidates, results] = await voting.getResults();
  console.log("\nFinal Results:");
  for (let i = 0; i < candidates.length; i++) {
    console.log(`${candidates[i]}: ${results[i].toString()}`);
  }
}

main().catch(console.error);
