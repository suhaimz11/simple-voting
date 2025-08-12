const { ethers } = require("hardhat");

async function main() {
    const votingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed contract address
    const Voting = await ethers.getContractFactory("SimpleVoting");
    const voting = Voting.attach(votingAddress);

    // Vote for Alice
    const tx = await voting.voteAlice();
    await tx.wait();
    console.log("✅ Voted for Alice");

    // Retrieve updated vote counts
    const aliceVotes = await voting.votesForAlice(); // <-- must have ()
    const bobVotes = await voting.votesForBob();     // <-- must have ()

    console.log(`Alice has ${aliceVotes.toString()} votes`);
    console.log(`Bob has ${bobVotes.toString()} votes`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
