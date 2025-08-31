"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

export default function WalletWrapper() {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse bg-primary-30 h-12 w-40 rounded-lg"></div>
        <p className="text-gray-400">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <WalletMultiButton className="btn btn-primary !text-lg !px-8 !py-3" />
      {publicKey && (
        <div className="text-center animate-fade">
          <p className="text-gray-400 text-sm mb-2">Connected Wallet:</p>
          <p className="text-white font-mono text-sm break-all glass-card">
            {publicKey.toBase58()}
          </p>
        </div>
      )}
    </div>
  );
}
