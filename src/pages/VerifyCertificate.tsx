
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Search, CheckCircle, XCircle, Loader2, Calendar, User, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { certificateAPI } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

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

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<Certificate | null>(null);
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: certificateAPI.verify,
    onSuccess: (data) => {
      setVerificationResult(data);
      if (data.isValid) {
        toast({
          title: "Certificate Verified",
          description: "This certificate is valid and authentic.",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "This certificate could not be verified.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      setVerificationResult(null);
      toast({
        title: "Certificate Not Found",
        description: "No certificate found with this ID.",
        variant: "destructive",
      });
      console.error("Verification error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      toast({
        title: "Missing Certificate ID",
        description: "Please enter a certificate ID to verify.",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate(certificateId.trim());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Search className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Certificate</h2>
            <p className="text-gray-600">
              Enter a certificate ID to verify its authenticity on the blockchain.
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>
                Enter the certificate ID you want to verify. This will check both our database and the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <Input
                    id="certificateId"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="Enter certificate ID (e.g., CERT-2024-ABC123)"
                    className="font-mono"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationResult && (
            <Card className={`border-0 shadow-xl ${verificationResult.isValid ? 'bg-green-50/80' : 'bg-red-50/80'} backdrop-blur-sm`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    {verificationResult.isValid ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mr-2" />
                    )}
                    {verificationResult.isValid ? 'Certificate Verified' : 'Verification Failed'}
                  </CardTitle>
                  <Badge variant={verificationResult.isValid ? 'default' : 'destructive'}>
                    {verificationResult.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      Recipient
                    </div>
                    <p className="font-semibold">{verificationResult.recipientName}</p>
                    {verificationResult.recipientEmail && (
                      <p className="text-sm text-gray-600">{verificationResult.recipientEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      Achievement
                    </div>
                    <p className="font-semibold">{verificationResult.courseName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-2" />
                      Issuer
                    </div>
                    <p className="font-semibold">{verificationResult.issuerName}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Completion Date
                    </div>
                    <p className="font-semibold">
                      {verificationResult.completionDate ? formatDate(verificationResult.completionDate) : 'Not specified'}
                    </p>
                  </div>
                </div>

                {verificationResult.description && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Description</div>
                    <p className="text-sm bg-white/50 p-3 rounded-lg">{verificationResult.description}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <strong>Certificate ID:</strong> {verificationResult.certificateId}
                    </div>
                    <div>
                      <strong>Issued:</strong> {formatDate(verificationResult.issuedAt)}
                    </div>
                    <div className="md:col-span-2">
                      <strong>Blockchain Hash:</strong> 
                      <span className="font-mono ml-1 break-all">{verificationResult.blockchainHash}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
