import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const contractABI = [
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
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


const contractAddress = "ENTER CONTRACT ADDRESS HERE"; // Replace with your contract address

export default function VotingApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votingEnded, setVotingEnded] = useState(false);
  const [newCandidate, setNewCandidate] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [account, setAccount] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [metaMaskMissing, setMetaMaskMissing] = useState(false);
  const [results, setResults] = useState(null);
  const [showResultsButton, setShowResultsButton] = useState(true);

  const openModal = (message) => { setModalMessage(message); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!window.ethereum) {
      setMetaMaskMissing(true);
      return;
    }

    async function init() {
      const prov = new BrowserProvider(window.ethereum);
      setProvider(prov);

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signerInstance = await prov.getSigner();
      setSigner(signerInstance);

      const addr = await signerInstance.getAddress();
      setAccount(addr);

      const votingContract = new Contract(contractAddress, contractABI, signerInstance);
      setContract(votingContract);

      const adminAddress = await votingContract.admin();
      setIsAdmin(adminAddress.toLowerCase() === addr.toLowerCase());

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
    if (!newCandidate.trim()) return openModal("Enter candidate name");
    try {
      const tx = await contract.addCandidate(newCandidate.trim());
      await tx.wait();
      openModal(`Candidate "${newCandidate}" added`);
      setNewCandidate("");
      await loadCandidates(contract);
    } catch (e) {
      openModal("Error adding candidate: " + (e.reason || e.message));
    }
  }

  async function vote() {
    if (!selectedCandidate) return openModal("Select a candidate");
    try {
      const tx = await contract.vote(selectedCandidate);
      await tx.wait();
      openModal(`Voted for "${selectedCandidate}"`);
      await checkVotingEnded(contract);
    } catch (e) {
      openModal("Voting error: " + (e.reason || e.message));
    }
  }

  async function endVoting() {
    try {
      const tx = await contract.endVoting();
      await tx.wait();
      setVotingEnded(true);
      openModal("Voting has ended");
    } catch (e) {
      openModal("Failed to end voting: " + (e.reason || e.message));
    }
  }

  async function showResults() {
    if (!votingEnded) return openModal("Voting is not ended yet");
    try {
      const [names, votes] = await contract.getResults();
      const voteCounts = votes.map(v => v.toNumber ? v.toNumber() : Number(v));
      const maxVotes = Math.max(...voteCounts);
      const winners = names.filter((name, i) => voteCounts[i] === maxVotes);

      setResults({ names, voteCounts, winners });
      setShowResultsButton(false); // hide the button after showing results
    } catch (e) {
      openModal("Failed to fetch results: " + (e.reason || e.message));
    }
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="app-title">BlockVote</h1>
        <p className="account-info">Connected: <span>{account}</span></p>
        {isAdmin && <p className="admin-badge">Admin</p>}

        {!votingEnded && (
          <>
            {isAdmin && (
              <div className="section">
                <h2>Add Candidate</h2>
                <input
                  type="text"
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                  placeholder="Candidate name"
                  className="input-field"
                />
                <button onClick={addCandidate} className="btn yellow-btn">Add Candidate</button>
              </div>
            )}

            <div className="section">
              <h2>Vote</h2>
              <select
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Candidate --</option>
                {candidates.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <button onClick={vote} className="btn yellow-btn">Vote</button>
            </div>

            {isAdmin && (
              <div className="section">
                <h2>Admin Controls</h2>
                <button onClick={endVoting} className="btn red-btn">End Voting</button>
              </div>
            )}
          </>
        )}

        {votingEnded && (
          <div className="section">
            <h2>Voting Ended</h2>
            {showResultsButton && (
              <button onClick={showResults} className="btn green-btn">Show Results</button>
            )}
          </div>
        )}

        {results && (
          <div className="section">
            <h2>Results</h2>
            {results.names.map((name, i) => (
              <p key={i}>{name}: {results.voteCounts[i]} vote{results.voteCounts[i] !== 1 ? 's' : ''}</p>
            ))}
            <h3 style={{ color: "#00ff99", marginTop: "15px" }}>
              Winner: {results.winners.join(", ")} 🎉
            </h3>
            <p>Congratulations to the winner{results.winners.length > 1 ? "s" : ""}!</p>
          </div>
        )}
      </div>

      {(modalOpen || metaMaskMissing) && (
        <div className="modal-overlay" onClick={() => { setModalOpen(false); setMetaMaskMissing(false); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>{metaMaskMissing ? "Please install MetaMask!" : modalMessage}</p>
            <button
              onClick={() => { setModalOpen(false); setMetaMaskMissing(false); }}
              className="btn yellow-btn modal-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
