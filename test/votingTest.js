const { expect } = require("chai");

describe("SimpleVoting", function () {
  it("Should allow voting for Alice and Bob", async function () {
    const Voting = await ethers.getContractFactory("SimpleVoting");
    const voting = await Voting.deploy();

    // Vote for Alice
    await voting.voteAlice();
    expect(await voting.votesForAlice()).to.equal(1);

    // Vote for Bob with another account
    const [_, voter2] = await ethers.getSigners();
    await voting.connect(voter2).voteBob();
    expect(await voting.votesForBob()).to.equal(1);
  });

  it("Should not allow double voting", async function () {
    const Voting = await ethers.getContractFactory("SimpleVoting");
    const voting = await Voting.deploy();

    await voting.voteAlice();
    await expect(voting.voteAlice()).to.be.revertedWith("You already voted");
  });
});
