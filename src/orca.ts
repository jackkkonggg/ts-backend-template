import anchor from '@coral-xyz/anchor';
import { Percentage } from '@orca-so/common-sdk/dist/math';
import {
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PriceMath,
  WhirlpoolContext,
  buildWhirlpoolClient,
  decreaseLiquidityQuoteByLiquidityWithParams,
  increaseLiquidityQuoteByInputToken,
} from '@orca-so/whirlpools-sdk';
import { Keypair, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { connection } from './lib/utils/connection';

async function main() {
  const orcaWallet = new anchor.Wallet(Keypair.generate());
  const provider = new anchor.AnchorProvider(connection, orcaWallet, anchor.AnchorProvider.defaultOptions()); // anchor.AnchorProvider.defaultOptions()
  const ctx = WhirlpoolContext.withProvider(provider, ORCA_WHIRLPOOL_PROGRAM_ID);
  const fetcher = ctx.fetcher;
  const client = buildWhirlpoolClient(ctx);
  const poolAddress = new PublicKey('7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm'); // SOL-USDC
  const pool = await client.getPool(poolAddress);

  // [Action] Create a position at price 36, 80 with 0.001 token A
  const inputTokenMint = pool.getData().tokenMintA; // SOL
  const inputTokenAmount = 0.001;
  const lowerPrice = new Decimal(36);
  const upperPrice = new Decimal(80);
  const sourceWalletKey = ctx.wallet.publicKey;
  const tokenADecimal = pool.getTokenAInfo().decimals;
  const tokenBDecimal = pool.getTokenBInfo().decimals;
  const tickSpacing = pool.getData().tickSpacing;
  const lowerTick = PriceMath.priceToInitializableTickIndex(lowerPrice, tokenADecimal, tokenBDecimal, tickSpacing);
  const upperTick = PriceMath.priceToInitializableTickIndex(upperPrice, tokenADecimal, tokenBDecimal, tickSpacing);
  const quote = await increaseLiquidityQuoteByInputToken(
    inputTokenMint,
    new Decimal(inputTokenAmount),
    lowerTick,
    upperTick,
    Percentage.fromFraction(1, 100),
    pool,
  );

  console.log(quote);
  console.log(quote.tokenMaxA.toString());
  console.log(quote.tokenMaxB.toString());
  console.log(quote.liquidityAmount.toString());

  // [Action] Open Position (and increase L)
  const { positionMint, tx } = await pool.openPosition(
    lowerTick,
    upperTick,
    quote,
    sourceWalletKey,
    ctx.wallet.publicKey,
  );

  // tx.addSigner(wallet);

  // const hash = await tx.buildAndExecute();
  // console.log('PositionMint: ', positionMint.toString(), 'Hash: ', hash);
}
