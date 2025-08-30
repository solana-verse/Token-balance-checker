import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { NextRequest } from "next/server";

interface TokenWithAmount{
    mint:string,
    amount:string
}

const connection = new Connection(clusterApiUrl("devnet"));

export default async function POST(req: NextRequest) {
    const body = await req.json();

    const address = new PublicKey(body.address);

    try{
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(address, {
        programId: TOKEN_PROGRAM_ID
    });

    let allTokensWithAmount: TokenWithAmount[] = [];

    tokenAccounts.value.forEach((tokenAccount) => {
        const { mint, amount } = tokenAccount.account.data.parsed.info;
        if (amount.uiAmount > 0) {
            allTokensWithAmount.push({ mint, amount: amount.uiAmountString });
        }
    });
      return new Response(JSON.stringify(allTokensWithAmount), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });

}catch(error){
    console.error("Error fetching token accounts:", error);
    return new Response("Error fetching token accounts", { status: 500 });
}

  

}