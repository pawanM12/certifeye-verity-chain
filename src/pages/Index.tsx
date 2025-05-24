
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileCheck, Search, Database, Blocks, Cpu } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Certificates stored on Ethereum blockchain for immutable verification"
    },
    {
      icon: Database,
      title: "MongoDB Integration",
      description: "Fast metadata storage and retrieval with MongoDB"
    },
    {
      icon: Blocks,
      title: "Smart Contracts",
      description: "Hardhat-powered smart contracts for certificate management"
    },
    {
      icon: Cpu,
      title: "Mac M2 Optimized",
      description: "Fully compatible with Apple Silicon architecture"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CertChain</h1>
              <Badge variant="secondary" className="ml-2">MERN + Blockchain</Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/issue" className="text-gray-600 hover:text-blue-600 transition-colors">
                Issue Certificate
              </Link>
              <Link to="/verify" className="text-gray-600 hover:text-blue-600 transition-colors">
                Verify Certificate
              </Link>
              <Link to="/certificates" className="text-gray-600 hover:text-blue-600 transition-colors">
                View Certificates
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Decentralized Certificate
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Verification System
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Secure, immutable, and verifiable certificates powered by blockchain technology.
              Built with MERN stack and optimized for Mac M2 Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/issue">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  <FileCheck className="mr-2 h-5 w-5" />
                  Issue Certificate
                </Button>
              </Link>
              <Link to="/verify">
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  <Search className="mr-2 h-5 w-5" />
                  Verify Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Powered by Modern Technology</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our system combines the best of web development and blockchain technology
              to provide a secure and efficient certificate verification platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['MongoDB', 'Express.js', 'React', 'Node.js', 'Ethereum', 'Hardhat', 'TypeScript'].map((tech) => (
                <Badge key={tech} variant="outline" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-semibold">CertChain</span>
          </div>
          <p className="text-gray-400">
            Decentralized certificate verification system built with MERN stack and blockchain technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
