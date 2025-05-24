
# CertChain - Decentralized Certificate Verification System

A comprehensive MERN stack application with blockchain integration for issuing and verifying certificates. Built for Mac M2 2022 Pro with full local development support.

## 🚀 Features

- **Certificate Issuance**: Create new certificates with metadata stored in MongoDB and hash verification on blockchain
- **Certificate Verification**: Verify certificate authenticity using blockchain technology
- **Certificate Registry**: Browse all issued certificates with search functionality
- **Responsive Design**: Modern, mobile-first interface built with React and Tailwind CSS
- **Blockchain Integration**: Ethereum smart contracts with Hardhat for local development
- **Real-time Updates**: React Query for efficient data fetching and caching

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Router** for navigation
- **React Query** for state management
- **Lucide React** for icons

### Backend (Simulated)
- **Node.js** runtime
- **Express.js** REST API
- **MongoDB** for metadata storage
- **JWT** for authentication

### Blockchain
- **Ethereum** blockchain
- **Hardhat** development environment
- **Solidity** smart contracts
- **Ethers.js** for blockchain interaction

## 📋 Prerequisites

Before running this application on your Mac M2 2022 Pro, ensure you have:

- **Node.js** (v18 or higher) - Install via [nvm](https://github.com/nvm-sh/nvm)
- **MongoDB** - Local installation or MongoDB Atlas account
- **Git** for version control
- **Hardhat** for blockchain development

## 🚀 Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd certchain
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install frontend dependencies
npm install

# Install Hardhat and blockchain dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
\`\`\`

### 3. Environment Setup

Create a \`.env\` file in the root directory:
\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/certchain
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certchain

# Blockchain Configuration
ETHEREUM_NETWORK=localhost
ETHEREUM_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your_ethereum_private_key_here

# API Configuration
API_BASE_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_here

# Application Configuration
NODE_ENV=development
PORT=3001
\`\`\`

### 4. MongoDB Setup

#### Option A: Local MongoDB
\`\`\`bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Create database
mongosh
use certchain
\`\`\`

#### Option B: MongoDB Atlas
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get connection string and update \`.env\`

### 5. Blockchain Setup with Hardhat

\`\`\`bash
# Initialize Hardhat project
npx hardhat init

# Create the smart contract
mkdir contracts
\`\`\`

Create \`contracts/CertificateRegistry.sol\`:
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        string dataHash;
        uint256 timestamp;
        string issuer;
        bool isValid;
    }
    
    mapping(string => Certificate) public certificates;
    address public owner;
    
    event CertificateIssued(string indexed certificateId, string dataHash, string issuer);
    
    constructor() {
        owner = msg.sender;
    }
    
    function issueCertificate(
        string memory certificateId,
        string memory dataHash,
        string memory issuer
    ) public {
        certificates[certificateId] = Certificate({
            dataHash: dataHash,
            timestamp: block.timestamp,
            issuer: issuer,
            isValid: true
        });
        
        emit CertificateIssued(certificateId, dataHash, issuer);
    }
    
    function verifyCertificate(string memory certificateId) 
        public 
        view 
        returns (bool isValid, string memory dataHash, uint256 timestamp, string memory issuer) 
    {
        Certificate memory cert = certificates[certificateId];
        return (cert.isValid, cert.dataHash, cert.timestamp, cert.issuer);
    }
}
\`\`\`

### 6. Backend API Setup

Create \`server/app.js\`:
\`\`\`javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  recipientName: { type: String, required: true },
  recipientEmail: String,
  courseName: { type: String, required: true },
  issuerName: { type: String, required: true },
  completionDate: Date,
  description: String,
  issuedAt: { type: Date, default: Date.now },
  blockchainHash: { type: String, required: true },
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// Routes
app.post('/api/certificates/issue', async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.json({ certificateId: certificate.certificateId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/certificates/verify/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.id 
    });
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json({ ...certificate.toObject(), isValid: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ issuedAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

### 7. Package.json Scripts

Add to your \`package.json\`:
\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "server": "node server/app.js",
    "blockchain": "npx hardhat node",
    "deploy": "npx hardhat run scripts/deploy.js --network localhost",
    "dev-full": "concurrently \\"npm run server\\" \\"npm run blockchain\\" \\"npm run dev\\"
  }
}
\`\`\`

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start MongoDB** (if using local installation):
\`\`\`bash
brew services start mongodb/brew/mongodb-community
\`\`\`

2. **Start Hardhat Local Blockchain**:
\`\`\`bash
npx hardhat node
\`\`\`

3. **Deploy Smart Contract**:
\`\`\`bash
npx hardhat run scripts/deploy.js --network localhost
\`\`\`

4. **Start Backend Server**:
\`\`\`bash
npm run server
\`\`\`

5. **Start Frontend Development Server**:
\`\`\`bash
npm run dev
\`\`\`

6. **Access the Application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - Hardhat Network: http://localhost:8545

### Production Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 🧪 Testing

### Frontend Testing
\`\`\`bash
npm run test
\`\`\`

### Smart Contract Testing
\`\`\`bash
npx hardhat test
\`\`\`

### API Testing
\`\`\`bash
# Using curl to test certificate issuance
curl -X POST http://localhost:3001/api/certificates/issue \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipientName": "Test User",
    "courseName": "Test Course",
    "issuerName": "Test Institute",
    "blockchainHash": "0x123..."
  }'
\`\`\`

## 📁 Project Structure

\`\`\`
certchain/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and API clients
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript type definitions
├── server/
│   ├── app.js              # Express server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── middleware/         # Custom middleware
├── contracts/
│   └── CertificateRegistry.sol
├── scripts/
│   └── deploy.js           # Contract deployment
├── test/                   # Test files
└── docs/                   # Documentation
\`\`\`

## 🔧 Configuration

### Hardhat Configuration
Create \`hardhat.config.js\`:
\`\`\`javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
\`\`\`

### MongoDB Configuration
- **Local**: Default connection to \`mongodb://localhost:27017/certchain\`
- **Atlas**: Update connection string in \`.env\`
- **Collections**: \`certificates\`, \`users\`

### Environment Variables
- \`MONGODB_URI\`: Database connection string
- \`ETHEREUM_RPC_URL\`: Blockchain RPC endpoint
- \`PRIVATE_KEY\`: Ethereum private key for transactions
- \`JWT_SECRET\`: Secret for JWT token generation

## 🔐 Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Environment Variables**: Use \`.env\` for sensitive configuration
3. **Input Validation**: Validate all user inputs on both frontend and backend
4. **HTTPS**: Use HTTPS in production
5. **Rate Limiting**: Implement API rate limiting
6. **Authentication**: Implement proper user authentication

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
\`\`\`bash
npm run build
# Deploy the dist/ folder
\`\`\`

### Backend Deployment (Heroku/Railway)
\`\`\`bash
# Add Procfile
echo "web: node server/app.js" > Procfile
\`\`\`

### Smart Contract Deployment (Testnet/Mainnet)
\`\`\`bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
\`\`\`

## 🐛 Troubleshooting

### Common Issues on Mac M2

1. **Node.js Installation**:
\`\`\`bash
# Use nvm for proper M2 support
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
\`\`\`

2. **MongoDB Connection Issues**:
\`\`\`bash
# Check MongoDB status
brew services list | grep mongodb
brew services restart mongodb/brew/mongodb-community
\`\`\`

3. **Hardhat Network Issues**:
\`\`\`bash
# Reset Hardhat network
npx hardhat clean
npx hardhat node --reset
\`\`\`

4. **Port Conflicts**:
- Frontend: Change port in \`vite.config.ts\`
- Backend: Change PORT in \`.env\`
- Hardhat: Use different port in \`hardhat.config.js\`

## 📖 API Documentation

### Certificate Endpoints

#### POST /api/certificates/issue
Create a new certificate
\`\`\`json
{
  "recipientName": "John Doe",
  "recipientEmail": "john@example.com",
  "courseName": "Full Stack Development",
  "issuerName": "Tech Academy",
  "completionDate": "2024-01-15",
  "description": "Course description"
}
\`\`\`

#### GET /api/certificates/verify/:id
Verify certificate by ID
\`\`\`json
{
  "certificateId": "CERT-2024-ABC123",
  "isValid": true,
  "recipientName": "John Doe",
  "courseName": "Full Stack Development",
  "blockchainHash": "0x..."
}
\`\`\`

#### GET /api/certificates
Get all certificates
\`\`\`json
[
  {
    "certificateId": "CERT-2024-ABC123",
    "recipientName": "John Doe",
    "courseName": "Full Stack Development",
    "issuedAt": "2024-01-16T10:00:00.000Z"
  }
]
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@certchain.dev
- Discord: [CertChain Community](https://discord.gg/certchain)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Blockchain development with [Hardhat](https://hardhat.org/)
- Icons by [Lucide](https://lucide.dev/)

---

**CertChain** - Securing certificates with blockchain technology 🔐
\`\`\`
