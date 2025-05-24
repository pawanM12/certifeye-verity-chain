
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, FileText, Search, Calendar, User, Award, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { certificateAPI } from "@/lib/api";
import { useState } from "react";

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
}

const CertificateList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: certificates = [], isLoading, error } = useQuery({
    queryKey: ['certificates'],
    queryFn: certificateAPI.getAll,
  });

  const filteredCertificates = certificates.filter((cert: Certificate) =>
    cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CertChain</h1>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate Registry</h2>
            <p className="text-gray-600">
              Browse all issued certificates stored on the blockchain.
            </p>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search certificates by name, course, issuer, or certificate ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading certificates...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-0 shadow-lg bg-red-50/80 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-red-600">Failed to load certificates. Please try again later.</p>
              </CardContent>
            </Card>
          )}

          {/* Certificates Grid */}
          {!isLoading && !error && (
            <div className="space-y-6">
              {filteredCertificates.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {searchTerm ? 'No certificates found matching your search.' : 'No certificates have been issued yet.'}
                    </p>
                    <Link to="/issue" className="inline-block mt-4">
                      <Button>Issue First Certificate</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCertificates.map((certificate: Certificate) => (
                    <Card key={certificate._id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg mb-1">{certificate.courseName}</CardTitle>
                            <CardDescription>Certificate ID: {certificate.certificateId}</CardDescription>
                          </div>
                          <Badge variant="secondary">Verified</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              Recipient
                            </div>
                            <p className="font-medium">{certificate.recipientName}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Award className="h-4 w-4 mr-2" />
                              Issuer
                            </div>
                            <p className="font-medium">{certificate.issuerName}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              Completed
                            </div>
                            <p className="text-sm">
                              {certificate.completionDate ? formatDate(certificate.completionDate) : 'Not specified'}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              Issued
                            </div>
                            <p className="text-sm">{formatDate(certificate.issuedAt)}</p>
                          </div>
                        </div>

                        {certificate.description && (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Description</div>
                            <p className="text-sm bg-gray-50 p-3 rounded-lg">{certificate.description}</p>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              <span className="font-mono">Blockchain: {certificate.blockchainHash.substring(0, 16)}...</span>
                            </div>
                            <Link to={`/verify`}>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Verify
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredCertificates.length > 0 && (
                <div className="text-center pt-8">
                  <p className="text-gray-600">
                    Showing {filteredCertificates.length} of {certificates.length} certificates
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateList;
