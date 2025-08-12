import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "candidate",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getResults",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "candidate",
        "type": "string"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "candidate",
        "type": "string"
      }
    ],
    "name": "validCandidate",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "candidate",
        "type": "string"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEnded",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your deployed contract address

export default function VotingApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votingEnded, setVotingEnded] = useState(false);
  const [newCandidate, setNewCandidate] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    async function init() {
      const prov = new BrowserProvider(window.ethereum);
      setProvider(prov);

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await prov.getSigner();
      setSigner(signer);

      const addr = await signer.getAddress();
      setAccount(addr);

      const votingContract = new Contract(contractAddress, contractABI, signer);
      setContract(votingContract);

      await loadCandidates(votingContract);
      await checkVotingEnded(votingContract);
    }

    init();
  }, []);

  async function loadCandidates(contractInstance) {
    const count = await contractInstance.getCandidatesCount();
    const list = [];
    for (let i = 0; i < count; i++) {
      const candidate = await contractInstance.candidates(i);
      list.push(candidate);
    }
    setCandidates(list);
  }

  async function checkVotingEnded(contractInstance) {
    const ended = await contractInstance.votingEnded();
    setVotingEnded(ended);
  }

  async function addCandidate() {
    if (!newCandidate.trim()) return alert("Enter candidate name");
    try {
      const tx = await contract.addCandidate(newCandidate.trim());
      await tx.wait();
      alert(`Candidate "${newCandidate}" added`);
      setNewCandidate("");
      await loadCandidates(contract);
    } catch (e) {
      alert("Error adding candidate: " + (e.reason || e.message));
    }
  }

  async function vote() {
    if (!selectedCandidate) return alert("Select a candidate");
    try {
      const tx = await contract.vote(selectedCandidate);
      await tx.wait();
      alert(`Voted for "${selectedCandidate}"`);
      await checkVotingEnded(contract);
    } catch (e) {
      alert("Voting error: " + (e.reason || e.message));
    }
  }

  async function endVoting() {
    try {
      const tx = await contract.endVoting();
      await tx.wait();
      alert("Voting ended");
      setVotingEnded(true);
    } catch (e) {
      alert("Failed to end voting: " + (e.reason || e.message));
    }
  }

  async function showResults() {
    if (!votingEnded) return alert("Voting is not ended yet");
    try {
      const [names, votes] = await contract.getResults();
      let results = "";
      for (let i = 0; i < names.length; i++) {
        results += `${names[i]}: ${votes[i].toString()}\n`;
      }
      alert("Results:\n" + results);
    } catch (e) {
      alert("Failed to fetch results: " + (e.reason || e.message));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Simple Voting DApp</h2>
      <p><b>Connected account:</b> {account}</p>

      {!votingEnded && (
        <>
          <h3>Add Candidate</h3>
          <input
            type="text"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
            placeholder="Candidate name"
          />
          <button onClick={addCandidate}>Add Candidate</button>

          <h3>Vote</h3>
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
          >
            <option value="">-- Select Candidate --</option>
            {candidates.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={vote}>Vote</button>

          <h3>Admin</h3>
          <button onClick={endVoting}>End Voting</button>
        </>
      )}

      {votingEnded && (
        <>
          <h3>Voting Ended</h3>
          <button onClick={showResults}>Show Results</button>
        </>
      )}
    </div>
  );
}
