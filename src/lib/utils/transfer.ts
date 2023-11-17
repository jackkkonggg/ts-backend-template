import { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { connection } from './connection';

export async function transfer(keypair: Keypair, to: PublicKey, lamportAmount: number) {
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: to,
      lamports: lamportAmount,
    }),
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
  console.info('Transfer sig: ', signature);
  return signature;
}
