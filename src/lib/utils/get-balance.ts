import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { connection } from './connection';

export async function getBalance(pubkey: PublicKey, raw?: true) {
  const balanceInLamports = await connection.getBalance(pubkey);
  if (raw) {
    return balanceInLamports;
  }
  return balanceInLamports / LAMPORTS_PER_SOL;
}

// 张亮
// yuzhiqiang
