const { ethers } = require("hardhat");
const readline = require("readline");

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }))
}

async function main() {
  const signers = await ethers.getSigners();

  // List accounts
  console.log("Available accounts:");
  signers.forEach((s, i) => {
    console.log(`${i}: ${s.address}`);
  });

  const accountIndex = parseInt(await ask("Choose account index to vote from: "));
  if (isNaN(accountIndex) || accountIndex < 0 || accountIndex >= signers.length) {
    console.log("Invalid account index!");
    return;
  }

  const candidate = (await ask("Vote for Alice or Bob? (A/B): ")).toUpperCase();
  if (candidate !== "A" && candidate !== "B") {
    console.log("Invalid candidate choice!");
    return;
  }

  const votingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Voting = await ethers.getContractFactory("SimpleVoting");
  const voting = Voting.attach(votingAddress).connect(signers[accountIndex]);

  try {
    if (candidate === "A") {
      const tx = await voting.voteAlice();
      await tx.wait();
      console.log(`✅ Voted for Alice from account ${signers[accountIndex].address}`);
    } else {
      const tx = await voting.voteBob();
      await tx.wait();
      console.log(`✅ Voted for Bob from account ${signers[accountIndex].address}`);
    }

    const aliceVotes = await voting.votesForAlice();
    const bobVotes = await voting.votesForBob();

    console.log(`\nCurrent vote count:`);
    console.log(`Alice: ${aliceVotes.toString()}`);
    console.log(`Bob: ${bobVotes.toString()}`);

  } catch (err) {
    console.error("Transaction failed:", err.reason || err.message);
  }
}

main().catch(console.error);
