// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleVoting {
    string public candidate1 = "Alice";
    string public candidate2 = "Bob";

    uint public votesForAlice;
    uint public votesForBob;

    mapping(address => bool) public hasVoted;

    function voteAlice() public {
        require(!hasVoted[msg.sender], "You already voted");
        votesForAlice++;
        hasVoted[msg.sender] = true;
    }

    function voteBob() public {
        require(!hasVoted[msg.sender], "You already voted");
        votesForBob++;
        hasVoted[msg.sender] = true;
    }
}
