const { ethers } = require("hardhat");
const readline = require("readline");

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve =>
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function main() {
  const signers = await ethers.getSigners();

  console.log("Available accounts:");
  signers.forEach((s, i) => console.log(`${i}: ${s.address}`));

  const accountIndex = parseInt(await ask("Choose account index to vote from: "));
  if (isNaN(accountIndex) || accountIndex < 0 || accountIndex >= signers.length) {
    console.log("Invalid account index!");
    return;
  }

  const votingAddress = "ENTER_YOUR_VOTING_CONTRACT_ADDRESS_HERE"; // Replace with your deployed contract address
  const Voting = await ethers.getContractFactory("SimpleVoting");
  const voting = Voting.attach(votingAddress).connect(signers[accountIndex]);

  const candidatesCount = await voting.getCandidatesCount();
  if (candidatesCount === 0) {
    console.log("No candidates found.");
    return;
  }

  console.log("\nCandidates:");
  for (let i = 0; i < candidatesCount; i++) {
    const candidate = await voting.candidates(i);
    console.log(`${i}: ${candidate}`);
  }

  const choice = parseInt(await ask("Enter candidate number to vote for: "));
  if (isNaN(choice) || choice < 0 || choice >= candidatesCount) {
    console.log("Invalid choice!");
    return;
  }

  const chosenCandidate = await voting.candidates(choice);

  try {
    const tx = await voting.vote(chosenCandidate);
    await tx.wait();
    console.log(`✅ Voted for ${chosenCandidate} from account ${signers[accountIndex].address}`);
  } catch (err) {
    console.error("Transaction failed:", err.reason || err.message);
  }
}

main().catch(console.error);
