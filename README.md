BlockVote is a decentralized voting app built on Ethereum. It allows secure voting, admin management of candidates, and displays results in a clean, tabular format. Ideal for learning blockchain-based voting systems.

🚀 Features
Admin can add candidates.

Users can vote for candidates.

Admin can end voting.

Results displayed in a clean table with winners highlighted.

MetaMask integration for account authentication.

🛠️ Tech Stack
Frontend: React.js

Blockchain: Ethereum (Hardhat local network)

Library: Ethers.js

Wallet: MetaMask

⚡ Setup
Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/simple-voting.git
cd simple-voting
Install dependencies

bash
Copy
Edit
npm install
Run the app

bash
Copy
Edit
npm start
Deploy the Smart Contract
Use Hardhat to deploy locally:

bash
Copy
Edit
npx hardhat run scripts/deploy.js --network localhost
Connect MetaMask

Add your Hardhat local network.

Use one of the accounts provided by Hardhat.

🎯 How to Use
Admin adds candidates.

Users select a candidate and vote.

Admin ends the voting session.

View results .

📄 License
This project is licensed under the MIT License.
