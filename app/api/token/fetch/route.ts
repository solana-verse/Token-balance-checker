import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

interface TokenWithAmount {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number;
}

// Multiple RPC endpoints for better reliability
const RPC_ENDPOINTS = [
  "https://api.devnet.solana.com",
  clusterApiUrl("devnet"),
  "https://devnet.helius-rpc.com/?api-key=demo",
];

// Create connection with retry logic
async function fetchWithRetry(address: PublicKey, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const connection = new Connection(
        RPC_ENDPOINTS[i % RPC_ENDPOINTS.length],
        {
          commitment: "confirmed",
          confirmTransactionInitialTimeout: 30000,
        }
      );

      // Fetch SOL balance
      const solBalance = await connection.getBalance(address);

      // Fetch SPL token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        address,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      let allTokensWithAmount: TokenWithAmount[] = [];

      tokenAccounts.value.forEach((tokenAccount: any) => {
        const accountData = tokenAccount.account.data.parsed.info;
        const { mint, tokenAmount } = accountData;

        if (tokenAmount.uiAmount > 0) {
          allTokensWithAmount.push({
            mint,
            amount: tokenAmount.amount,
            decimals: tokenAmount.decimals,
            uiAmount: tokenAmount.uiAmount,
          });
        }
      });

      return {
        solBalance: solBalance / 1e9, // Convert lamports to SOL
        tokens: allTokensWithAmount,
      };
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed with endpoint ${
          RPC_ENDPOINTS[i % RPC_ENDPOINTS.length]
        }:`,
        error
      );
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const address = new PublicKey(body.address);
    const result = await fetchWithRetry(address);

    return NextResponse.json({
      ...result,
      wallet: body.address,
    });
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    return NextResponse.json(
      {
        error: "Error fetching token accounts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("address");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const address = new PublicKey(walletAddress);
    const result = await fetchWithRetry(address);

    return NextResponse.json({
      ...result,
      wallet: walletAddress,
    });
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    return NextResponse.json(
      {
        error: "Error fetching token accounts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
