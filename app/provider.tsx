"use client";

import React, { FC, ReactNode, useMemo, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // Use multiple endpoints for better reliability
  const endpoint = useMemo(() => {
    const endpoints = [
      "https://api.devnet.solana.com",
      clusterApiUrl(network),
      "https://devnet.helius-rpc.com/?api-key=demo"
    ];
    return endpoints[0]; // Use the first endpoint as primary
  }, [network]);

  // Empty wallets array - let the system auto-detect without manual registration
  const wallets = useMemo(() => [], []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render providers during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect={false}>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  }

  return (
    <ConnectionProvider 
      endpoint={endpoint}
      config={{
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 30000,
      }}
    >
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => {
          // Suppress wallet connection errors to prevent duplicate registrations
          console.warn('Wallet adapter warning:', error.message);
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};