"use client"
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the wallet wrapper to prevent SSR issues
const WalletWrapper = dynamic(() => import("./components/WalletWrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-pulse bg-gray-700 h-12 w-40 rounded-lg"></div>
      <p className="text-gray-400">Loading wallet...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center animate-fade">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Your Solana
              <span className="text-gradient block mt-2">
                Portfolio Hub
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-delayed">
              Professional-grade portfolio tracking for Solana. Monitor token balances, analyze performance, and manage your digital assets with precision.
            </p>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto animate-fade-delayed">
              <div className="glass card-gradient ring-accent shine">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-green-400 rounded-full flex items-center justify-center text-2xl">⚡</div>
                  <h3 className="text-white text-lg font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-300 text-sm">Real-time balance updates powered by Solana's high-speed network</p>
                </div>
              </div>
              
              <div className="glass card-gradient ring-accent shine">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">�</div>
                  <h3 className="text-white text-lg font-semibold mb-2">Deep Analytics</h3>
                  <p className="text-gray-300 text-sm">Complete portfolio insights with token metadata and performance</p>
                </div>
              </div>
              
              <div className="glass card-gradient ring-accent shine">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">�️</div>
                  <h3 className="text-white text-lg font-semibold mb-2">Secure & Private</h3>
                  <p className="text-gray-300 text-sm">Non-custodial design with enterprise-grade security standards</p>
                </div>
              </div>
            </div>
            
            {/* Wallet Connection */}
            <div className="space-y-8 animate-fade-delayed">
              <WalletWrapper />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/dashboard" 
                  className="btn btn-primary animate-glow"
                >
                  <span>⚡</span>
                  Open SolVault
                </Link>
                <a 
                  href="https://docs.solana.com/wallet-guide" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <span>📚</span>
                  Learn Solana
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="bg-black/20 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-400">Wallets Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500K+</div>
              <div className="text-gray-400">Tokens Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Real-time Updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
