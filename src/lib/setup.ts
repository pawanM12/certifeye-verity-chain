
// MERN Stack Setup Utilities
// Handles environment detection and configuration

export interface MERNConfig {
  apiUrl: string;
  mongoUri: string;
  jwtSecret: string;
  nodeEnv: string;
  frontendUrl: string;
  backendPort: number;
}

export const getEnvironmentConfig = (): MERNConfig => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return {
    apiUrl: isDevelopment ? 'http://localhost:3001/api' : process.env.REACT_APP_API_URL || '',
    mongoUri: process.env.REACT_APP_MONGO_URI || 'mongodb://localhost:27017/certchain',
    jwtSecret: process.env.REACT_APP_JWT_SECRET || 'your-jwt-secret-key',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: isDevelopment ? 'http://localhost:5173' : process.env.REACT_APP_FRONTEND_URL || '',
    backendPort: parseInt(process.env.REACT_APP_BACKEND_PORT || '3001')
  };
};

export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = getEnvironmentConfig();

  if (!config.apiUrl) {
    errors.push('API URL is not configured');
  }

  if (!config.mongoUri) {
    errors.push('MongoDB URI is not configured');
  }

  if (!config.jwtSecret || config.jwtSecret === 'your-jwt-secret-key') {
    errors.push('JWT Secret is not properly configured');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// MERN Stack Setup Instructions
export const getMERNSetupInstructions = () => {
  return {
    steps: [
      {
        title: "1. Create Backend Directory Structure",
        commands: [
          "mkdir server",
          "cd server",
          "npm init -y"
        ],
        description: "Initialize the Express.js backend"
      },
      {
        title: "2. Install Backend Dependencies",
        commands: [
          "npm install express mongoose cors dotenv bcryptjs jsonwebtoken",
          "npm install -D nodemon concurrently"
        ],
        description: "Install required packages for MERN backend"
      },
      {
        title: "3. Create Environment File",
        commands: [
          "touch .env"
        ],
        content: `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/certchain
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certchain

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173`,
        description: "Configure environment variables"
      },
      {
        title: "4. Create Backend Server",
        filename: "server/app.js",
        content: `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

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
  isValid: { type: Boolean, default: true }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/certificates', async (req, res) => {
  try {
    const { recipientName, recipientEmail, courseName, issuerName, completionDate, description } = req.body;
    
    // Generate certificate ID
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = \`CERT-\${year}-\${random}\`;
    
    // Generate blockchain hash (in production, this would be from actual blockchain)
    const blockchainHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const certificate = new Certificate({
      certificateId,
      recipientName,
      recipientEmail,
      courseName,
      issuerName,
      completionDate,
      description,
      blockchainHash
    });
    
    await certificate.save();
    res.json({ certificateId });
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
    
    res.json(certificate);
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
});`,
        description: "Create the Express.js server with MongoDB integration"
      },
      {
        title: "5. Update Package.json Scripts",
        content: `{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "server": "cd server && node app.js",
    "server:dev": "cd server && nodemon app.js",
    "server:setup": "cd server && npm install",
    "full-dev": "concurrently \\"npm run server:dev\\" \\"npm run dev\\"",
    "setup": "npm install && npm run server:setup"
  }
}`,
        description: "Add scripts to run the full MERN stack"
      },
      {
        title: "6. Install Frontend Dependencies",
        commands: [
          "npm install concurrently"
        ],
        description: "Install concurrently to run frontend and backend together"
      }
    ],
    troubleshooting: {
      permissionErrors: [
        "Run 'chmod +x scripts/*' to make scripts executable",
        "Check if .env file exists and has proper permissions",
        "Ensure MongoDB service is running: 'brew services start mongodb/brew/mongodb-community' (Mac) or 'sudo systemctl start mongod' (Linux)"
      ],
      connectionErrors: [
        "Verify MongoDB is running on localhost:27017",
        "Check firewall settings for port 3001 and 27017",
        "Update MongoDB URI in .env if using different host/port"
      ],
      moduleErrors: [
        "Delete node_modules and package-lock.json, then run 'npm install'",
        "Check Node.js version compatibility (requires Node.js 16+)",
        "Run 'npm audit fix' to resolve dependency vulnerabilities"
      ]
    }
  };
};

// Test connectivity to backend
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const config = getEnvironmentConfig();
    const response = await fetch(`${config.apiUrl}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// Log setup status
export const logSetupStatus = () => {
  const config = getEnvironmentConfig();
  const validation = validateEnvironment();
  
  console.log('=== MERN Stack Configuration ===');
  console.log('Environment:', config.nodeEnv);
  console.log('API URL:', config.apiUrl);
  console.log('MongoDB URI:', config.mongoUri.replace(/\/\/.*@/, '//***@')); // Hide credentials
  console.log('Frontend URL:', config.frontendUrl);
  console.log('Configuration Valid:', validation.isValid);
  
  if (!validation.isValid) {
    console.log('Configuration Errors:');
    validation.errors.forEach(error => console.log('- ', error));
  }
};
