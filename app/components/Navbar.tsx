"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey && mounted) {
      router.push("/dashboard");
    }
  }, [connected, publicKey, mounted, router]);

  if (!mounted) {
    return (
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/solvault-logo.svg" alt="SolVault" width={32} height={32} />
            <div className="text-xl font-bold text-white">SolVault</div>
          </Link>
          <div className="h-10 w-32 bg-primary-30 animate-pulse rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:text-accent transition-colors">
          <img src="/solvault-logo.svg" alt="SolVault" width={32} height={32} />
          <div className="text-xl font-bold text-white">SolVault</div>
          <div className="text-xs text-primary-muted ml-2">Portfolio Tracker</div>
        </Link>
        
        <div className="flex items-center gap-4">
          {connected && (
            <Link 
              href="/dashboard" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          )}
          <WalletMultiButton className="btn btn-primary" />
        </div>
      </div>
    </nav>
  );
}
