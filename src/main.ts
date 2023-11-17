import { OpenOrders } from '@project-serum/serum';
import { TokenAccount, SPL_ACCOUNT_LAYOUT, LIQUIDITY_STATE_LAYOUT_V4 } from '@raydium-io/raydium-sdk';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

async function getTokenAccounts(connection: Connection, owner: PublicKey) {
  const tokenResp = await connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  const accounts: TokenAccount[] = [];
  for (const { pubkey, account } of tokenResp.value) {
    accounts.push({
      pubkey,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(account.data),
      programId: null,
    });
  }

  return accounts;
}

// raydium pool id can get from api: https://api.raydium.io/v2/sdk/liquidity/mainnet.json
const SOL_USDC_POOL_ID = '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2';
const OPENBOOK_PROGRAM_ID = new PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX');

export async function parsePoolInfo() {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const owner = new PublicKey('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY');

  const tokenAccounts = await getTokenAccounts(connection, owner);

  // example to get pool info
  const info = await connection.getAccountInfo(new PublicKey(SOL_USDC_POOL_ID));
  if (!info) return;

  const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);
  console.info({ poolState });
  const openOrders = await OpenOrders.load(
    connection,
    poolState.openOrders,
    OPENBOOK_PROGRAM_ID, // OPENBOOK_PROGRAM_ID(marketProgramId) of each pool can get from api: https://api.raydium.io/v2/sdk/liquidity/mainnet.json
  );

  const baseDecimal = 10 ** poolState.baseDecimal.toNumber(); // e.g. 10 ^ 6
  const quoteDecimal = 10 ** poolState.quoteDecimal.toNumber();

  const baseTokenAmount = await connection.getTokenAccountBalance(poolState.baseVault);
  const quoteTokenAmount = await connection.getTokenAccountBalance(poolState.quoteVault);

  const basePnl = poolState.baseNeedTakePnl.toNumber() / baseDecimal;
  const quotePnl = poolState.quoteNeedTakePnl.toNumber() / quoteDecimal;

  const openOrdersBaseTokenTotal = openOrders.baseTokenTotal.toNumber() / baseDecimal;
  const openOrdersQuoteTokenTotal = openOrders.quoteTokenTotal.toNumber() / quoteDecimal;

  const base = (baseTokenAmount.value?.uiAmount || 0) + openOrdersBaseTokenTotal - basePnl;
  const quote = (quoteTokenAmount.value?.uiAmount || 0) + openOrdersQuoteTokenTotal - quotePnl;

  const denominator = new BN(10).pow(poolState.baseDecimal);

  const addedLpAccount = tokenAccounts.find((a) => a.accountInfo.mint.equals(poolState.lpMint));
  console.info({
    baseMint: poolState.baseMint.toBase58(),
    quoteMint: poolState.quoteMint.toBase58(),
    totalBase: base,
    totalQuote: quote,
    baseVaultBalance: baseTokenAmount.value.uiAmount,
    quoteVaultBalance: quoteTokenAmount.value.uiAmount,
    baseTokenDecimals: poolState.baseDecimal.toNumber(),
    quoteTokenDecimals: poolState.quoteDecimal.toNumber(),
    totalLp: poolState.lpReserve.div(denominator).toString(),
    addedLpAmount: addedLpAccount?.accountInfo.amount.toNumber() ?? 0 / baseDecimal,
  });
}

parsePoolInfo();
