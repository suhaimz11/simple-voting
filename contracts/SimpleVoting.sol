// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleVoting {
    address public admin; // Store admin address
    string[] public candidates;
    mapping(string => uint) private votes;
    mapping(address => bool) public hasVoted;
    bool public votingEnded = false;

    // Set admin when deploying
    constructor() {
        admin = msg.sender;
    }

    // Modifiers
    modifier onlyWhileVotingActive() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Add a candidate (admin only)
    function addCandidate(string memory candidate) public onlyAdmin {
        require(!validCandidate(candidate), "Candidate already exists");
        require(!votingEnded, "Cannot add candidates after voting ended");
        candidates.push(candidate);
    }

    // Vote for a candidate while voting is active (anyone can vote)
    function vote(string memory candidate) public onlyWhileVotingActive {
        require(!hasVoted[msg.sender], "You already voted");
        require(validCandidate(candidate), "Candidate not found");

        votes[candidate]++;
        hasVoted[msg.sender] = true;
    }

    // End the voting (admin only)
    function endVoting() public onlyAdmin {
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
