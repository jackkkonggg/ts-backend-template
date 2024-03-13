import { utils } from '@coral-xyz/anchor';
import { Wallet, loadKeypair, DriftClient, getUserAccountPublicKeySync, BN } from '@drift-labs/sdk';
import { PDAUtil } from '@orca-so/whirlpools-sdk';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { logAll } from './lib/utils/log-all';

const connection = new Connection(
  'https://solana-mainnet.g.alchemy.com/v2/DZRZbJnzrSkBB7LrEyhJ2uNAq9NEsyIW',
  // 'https://api.mainnet-beta.solana.com',
  'confirmed',
);
const wallet = new Wallet(loadKeypair(Keypair.generate().secretKey.toString()));

const driftClient = new DriftClient({
  connection,
  wallet,
  env: 'mainnet-beta',
});

async function main() {
  const marketIndex = 0;
  const pda = PublicKey.findProgramAddressSync(
    [Buffer.from(utils.bytes.utf8.encode('spot_market')), new BN(marketIndex).toArrayLike(Buffer, 'le', 2)],
    new PublicKey('dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'),
  );

  console.log({ pda, bytes: new BN(2).toArrayLike(Buffer, 'le', marketIndex).toJSON() });

  // user's address that we want to query
  const pubKey = new PublicKey('7w2xaWSTAKszpyv7dK88kLKoYgQBcJD6gYn6BtrA372x');
  // drift program address
  const driftProgram = new PublicKey('dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH');

  await driftClient.subscribe();
  const marketAccount = await driftClient.getSpotMarketAccount(marketIndex);
  const userAccount = await getUserAccountPublicKeySync(driftProgram, pubKey);
  const accountInfo = await driftClient.program.account.user.fetch(
    new PublicKey('6QLGRrkjQUy3KyE2gpVGgGfZH9ChJgpN5Aw1weRiZBAS'),
  );

  const deposits = accountInfo.totalDeposits.toString();
  const withdraws = accountInfo.totalWithdraws.toString();
  logAll(deposits);
  logAll(withdraws);
  logAll(accountInfo.spotPositions);
}

main();
