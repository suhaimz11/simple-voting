const { ethers } = require("hardhat");
const readline = require("readline");

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function main() {
  const signers = await ethers.getSigners();
  const votingAddress = "ENTER_YOUR_VOTING_CONTRACT_ADDRESS_HERE"; // Replace with your deployed contract address
  const Voting = await ethers.getContractFactory("SimpleVoting");
  const voting = Voting.attach(votingAddress).connect(signers[0]); // Using first signer for adding candidates

  while (true) {
    const candidate = await ask("Enter candidate name to add (or 'done' to finish): ");
    if (candidate.toLowerCase() === "done") break;

    try {
      const tx = await voting.addCandidate(candidate);
      await tx.wait();
      console.log(`✅ Candidate "${candidate}" added`);
    } catch (err) {
      console.error("Failed to add candidate:", err.reason || err.message);
    }
  }
}

main().catch(console.error);
