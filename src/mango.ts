import { Bank, IDL, MangoClient } from '@blockworks-foundation/mango-v4';
import { AnchorProvider, Program, getProvider } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';
import { logAll } from './lib/utils/log-all';

dotenv.config();

const connection = new Connection(
  'https://solana-mainnet.g.alchemy.com/v2/DZRZbJnzrSkBB7LrEyhJ2uNAq9NEsyIW',
  // 'https://api.mainnet-beta.solana.com',
  'confirmed',
);

const program = new Program(
  IDL,
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg',
  new AnchorProvider(connection, new NodeWallet(Keypair.generate()), {}),
);

const client = new MangoClient(
  program as unknown as any,
  new PublicKey('4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'),
  'mainnet-beta',
);

async function main() {
  console.log('main');
  const mangoAccount = await client.getMangoAccount(new PublicKey('9ERGaHDVCDQh71wyuZHGQJp2cn9RW3LLa3oPBt2bMW5h'));
  const groupPubKey = new PublicKey('78b8f4cGCwmZ9ysPFMWLaLTkkaYnUjwMJYStWe5RTSSX');
  // const group = await client.getGroup(groupPubKey);
  const banks = await client.getBanksForGroup({ publicKey: groupPubKey } as unknown as any);
  const solBank = banks.find((b) => b.publicKey.toBase58() === 'FqEhSJSP3ao8RwRSekaAQ9sNQBSANhfb6EPtxQBByyh5');
  const euroBank = banks.find((b) => b.publicKey.toBase58() === '9AZ2quj7pRTdUF4oA7GsT6xtiVY4YBT8RzW4LuSo4Aot');

  logAll({
    tokenDepositsUi: mangoAccount.getTokenDepositsUi(solBank),
    tokenBorrowsUi: mangoAccount.getTokenBorrowsUi(euroBank),
  });
}

main();
