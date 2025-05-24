
// API client for certificate operations
// This simulates the MERN stack backend API

interface Certificate {
  _id: string;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  issuerName: string;
  completionDate: string;
  description: string;
  issuedAt: string;
  blockchainHash: string;
  isValid: boolean;
}

interface IssueCertificateRequest {
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  issuerName: string;
  completionDate: string;
  description: string;
}

// Simulate blockchain hash generation
const generateBlockchainHash = (): string => {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Simulate certificate ID generation
const generateCertificateId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-${year}-${random}`;
};

// Simulate local storage as our "database"
const STORAGE_KEY = 'certchain_certificates';

const getCertificatesFromStorage = (): Certificate[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveCertificatesToStorage = (certificates: Certificate[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const certificateAPI = {
  // Issue a new certificate
  issue: async (data: IssueCertificateRequest): Promise<{ certificateId: string }> => {
    await delay(2000); // Simulate network delay and blockchain transaction time
    
    const certificates = getCertificatesFromStorage();
    const certificateId = generateCertificateId();
    
    const newCertificate: Certificate = {
      _id: Date.now().toString(),
      certificateId,
      ...data,
      issuedAt: new Date().toISOString(),
      blockchainHash: generateBlockchainHash(),
      isValid: true
    };
    
    certificates.push(newCertificate);
    saveCertificatesToStorage(certificates);
    
    console.log('Certificate issued:', newCertificate);
    
    return { certificateId };
  },

  // Verify a certificate
  verify: async (certificateId: string): Promise<Certificate> => {
    await delay(1500); // Simulate blockchain verification time
    
    const certificates = getCertificatesFromStorage();
    const certificate = certificates.find(cert => cert.certificateId === certificateId);
    
    if (!certificate) {
      throw new Error('Certificate not found');
    }
    
    console.log('Certificate verified:', certificate);
    
    return certificate;
  },

  // Get all certificates
  getAll: async (): Promise<Certificate[]> => {
    await delay(800); // Simulate API call
    
    const certificates = getCertificatesFromStorage();
    console.log('Retrieved certificates:', certificates);
    
    return certificates.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  }
};

// Initialize with sample data if storage is empty
const initializeSampleData = () => {
  const certificates = getCertificatesFromStorage();
  
  if (certificates.length === 0) {
    const sampleCertificates: Certificate[] = [
      {
        _id: '1',
        certificateId: 'CERT-2024-SAMPLE1',
        recipientName: 'John Doe',
        recipientEmail: 'john.doe@example.com',
        courseName: 'Full Stack Web Development',
        issuerName: 'Tech Academy',
        completionDate: '2024-01-15',
        description: 'Completed comprehensive full stack development course covering React, Node.js, MongoDB, and Express.js',
        issuedAt: '2024-01-16T10:00:00.000Z',
        blockchainHash: generateBlockchainHash(),
        isValid: true
      },
      {
        _id: '2',
        certificateId: 'CERT-2024-SAMPLE2',
        recipientName: 'Jane Smith',
        recipientEmail: 'jane.smith@example.com',
        courseName: 'Blockchain Development Fundamentals',
        issuerName: 'Crypto Institute',
        completionDate: '2024-02-28',
        description: 'Mastered blockchain development using Ethereum, Solidity, and smart contract deployment',
        issuedAt: '2024-03-01T14:30:00.000Z',
        blockchainHash: generateBlockchainHash(),
        isValid: true
      }
    ];
    
    saveCertificatesToStorage(sampleCertificates);
    console.log('Sample certificates initialized');
  }
};

// Initialize sample data when the module loads
initializeSampleData();
