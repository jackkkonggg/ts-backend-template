import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getKeypairFromEnvironment } from '@solana-developers/node-helpers';
import * as dotenv from 'dotenv';
import { getBalance } from '@/lib/utils/get-balance';
import { transfer } from '@/lib/utils/transfer';

dotenv.config();

async function main() {
  const keypair = getKeypairFromEnvironment('SECRET_KEY');
  const receiverKp = Keypair.generate();

  const balanceBefore = await getBalance(keypair.publicKey, true);
  console.debug({ balanceBefore });
  await transfer(keypair, receiverKp.publicKey, 1 * LAMPORTS_PER_SOL);
  const balanceAfter = await getBalance(keypair.publicKey, true);
  console.debug({ balanceAfter });
}

main();
