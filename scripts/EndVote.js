const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();

  const votingAddress = "ENTER_YOUR_VOTING_CONTRACT_ADDRESS_HERE"; // Replace with your deployed contract address
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
