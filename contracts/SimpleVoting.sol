// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleVoting {
    string[] public candidates;
    mapping(string => uint) private votes;
    mapping(address => bool) public hasVoted;
    bool public votingEnded = false;

    modifier onlyWhileVotingActive() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    // Add a candidate (anyone can call; you can add access control if needed)
    function addCandidate(string memory candidate) public {
        require(!validCandidate(candidate), "Candidate already exists");
        require(!votingEnded, "Cannot add candidates after voting ended");
        candidates.push(candidate);
    }

    // Vote for a candidate while voting is active
    function vote(string memory candidate) public onlyWhileVotingActive {
        require(!hasVoted[msg.sender], "You already voted");
        require(validCandidate(candidate), "Candidate not found");

        votes[candidate]++;
        hasVoted[msg.sender] = true;
    }

    // End the voting (can be called by anyone; add access control if needed)
    function endVoting() public {
        votingEnded = true;
    }

    // Check if candidate exists
    function validCandidate(string memory candidate) public view returns (bool) {
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(candidate))) {
                return true;
            }
        }
        return false;
    }

    // Get vote count for a candidate
    function getVotes(string memory candidate) public view returns (uint) {
        require(validCandidate(candidate), "Candidate not found");
        return votes[candidate];
    }

    // Get total number of candidates
    function getCandidatesCount() public view returns (uint) {
        return candidates.length;
    }

    // Get final results: returns array of candidates and their vote counts
    function getResults() public view returns (string[] memory, uint[] memory) {
        uint count = candidates.length;
        uint[] memory results = new uint[](count);

        for (uint i = 0; i < count; i++) {
            results[i] = votes[candidates[i]];
        }

        return (candidates, results);
    }
}
