"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useRouter } from "next/navigation";

interface TokenAccount {
  mint: string;
  balance: number;
  decimals: number;
  uiAmount: number;
}

interface TokenInfo {
  symbol: string;
  name: string;
  logoURI?: string;
}

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && connected === false) {
      router.push("/");
    }
  }, [connected, mounted, router]);

  useEffect(() => {
    if (publicKey && connection && mounted) {
      fetchBalances();
    }
  }, [publicKey, connection, mounted]);

  const fetchBalances = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);

      // Use the API endpoint for better reliability
      const response = await fetch('/api/token/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: publicKey.toBase58(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSolBalance(data.solBalance || 0);
      setTokenAccounts(data.tokens || []);

    } catch (error) {
      console.error("Error fetching balances:", error);
      // Fallback to direct connection if API fails
      try {
        const solBalance = await connection.getBalance(publicKey);
        setSolBalance(solBalance / 1e9);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        const accounts: TokenAccount[] = tokenAccounts.value.map((accountInfo) => {
          const accountData = accountInfo.account.data.parsed.info;
          return {
            mint: accountData.mint,
            balance: accountData.tokenAmount.amount,
            decimals: accountData.tokenAmount.decimals,
            uiAmount: accountData.tokenAmount.uiAmount || 0,
          };
        }).filter(account => account.uiAmount > 0);

        setTokenAccounts(accounts);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-white text-xl animate-fade">Loading your portfolio...</div>
      </div>
    );
  }

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center animate-fade">
          <h1 className="text-2xl text-white mb-4">Wallet Not Connected</h1>
          <p className="text-gray-400 mb-6">Please connect your wallet to view your dashboard</p>
          <button 
            onClick={() => router.push("/")}
            className="btn btn-primary"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient pt-6">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Dashboard</h1>
          <p className="text-gray-400">
            Wallet: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="h-4 bg-primary-30 rounded mb-4"></div>
                <div className="h-8 bg-primary-30 rounded mb-2"></div>
                <div className="h-4 bg-primary-30 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* SOL Balance Card */}
            <div className="glass-card ring-accent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Solana (SOL)</h3>
                  <p className="text-gray-400 text-sm">Native Token</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{solBalance.toFixed(4)} SOL</div>
                  <div className="text-gray-400 text-sm">≈ ${(solBalance * 100).toFixed(2)} USD</div>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">SPL Tokens</h2>
              <button
                onClick={fetchBalances}
                className="btn btn-secondary"
              >
                Refresh
              </button>
            </div>

            {/* Token Grid */}
            {tokenAccounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenAccounts.map((account, index) => (
                  <div
                    key={account.mint}
                    className="glass-card hover-lift"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#9945ff] to-[#14f195] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {account.mint.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">
                          {account.uiAmount.toFixed(account.decimals > 4 ? 4 : account.decimals)}
                        </div>
                        <div className="text-gray-400 text-xs">Tokens</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-white font-medium">Token #{index + 1}</div>
                      <div className="text-gray-400 text-sm font-mono break-all">
                        {account.mint.slice(0, 8)}...{account.mint.slice(-8)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Decimals: {account.decimals}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No SPL tokens found</div>
                <p className="text-gray-500">
                  Your wallet doesn&apos;t have any SPL tokens with balances greater than 0.
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{(tokenAccounts.length + 1).toString()}</div>
                  <div className="text-gray-400 text-sm">Total Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{tokenAccounts.length.toString()}</div>
                  <div className="text-gray-400 text-sm">SPL Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{solBalance.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">SOL Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Devnet</div>
                  <div className="text-gray-400 text-sm">Network</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
