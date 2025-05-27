
// API client for certificate operations
// MERN stack backend API integration

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

// Environment configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:3001/api';

// API client with proper error handling
class CertificateAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Fallback to localStorage for development/demo purposes
      console.warn('API request failed, using localStorage fallback:', error);
      return this.fallbackToLocalStorage(endpoint, options);
    }
  }

  private async fallbackToLocalStorage<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Simulate backend behavior with localStorage
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000); // Simulate network delay

    const STORAGE_KEY = 'certchain_certificates';
    const certificates = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    if (endpoint === '/certificates' && options.method === 'POST') {
      // Issue certificate
      const data = JSON.parse(options.body as string);
      const certificateId = this.generateCertificateId();
      
      const newCertificate: Certificate = {
        _id: Date.now().toString(),
        certificateId,
        ...data,
        issuedAt: new Date().toISOString(),
        blockchainHash: this.generateBlockchainHash(),
        isValid: true
      };
      
      certificates.push(newCertificate);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
      
      return { certificateId } as T;
    }

    if (endpoint.startsWith('/certificates/verify/')) {
      // Verify certificate
      const certificateId = endpoint.split('/').pop();
      const certificate = certificates.find((cert: Certificate) => cert.certificateId === certificateId);
      
      if (!certificate) {
        throw new Error('Certificate not found');
      }
      
      return certificate as T;
    }

    if (endpoint === '/certificates') {
      // Get all certificates
      return certificates.sort((a: Certificate, b: Certificate) => 
        new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
      ) as T;
    }

    throw new Error('Unknown endpoint');
  }

  private generateCertificateId(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${year}-${random}`;
  }

  private generateBlockchainHash(): string {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  // API Methods
  async issue(data: IssueCertificateRequest): Promise<{ certificateId: string }> {
    console.log('Issuing certificate:', data);
    return this.makeRequest('/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verify(certificateId: string): Promise<Certificate> {
    console.log('Verifying certificate:', certificateId);
    return this.makeRequest(`/certificates/verify/${certificateId}`);
  }

  async getAll(): Promise<Certificate[]> {
    console.log('Fetching all certificates');
    return this.makeRequest('/certificates');
  }

  // Health check for backend connectivity
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      return await this.makeRequest('/health');
    } catch (error) {
      console.warn('Backend health check failed, using localStorage mode');
      return {
        status: 'localStorage_fallback',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const certificateAPI = new CertificateAPI();

// Initialize with sample data for demo purposes
const initializeSampleData = () => {
  const STORAGE_KEY = 'certchain_certificates';
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (!stored) {
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
        blockchainHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
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
        blockchainHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        isValid: true
      }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCertificates));
    console.log('Sample certificates initialized for demo purposes');
  }
};

// Initialize on module load
initializeSampleData();

// Export types for use in components
export type { Certificate, IssueCertificateRequest };
