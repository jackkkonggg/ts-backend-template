import { Port, WalletId } from '@port.finance/port-sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import { logAll } from './lib/utils/log-all';

async function main() {
  const port = Port.forMainNet({
    connection: new Connection('https://solana-mainnet.g.alchemy.com/v2/DZRZbJnzrSkBB7LrEyhJ2uNAq9NEsyIW'),
  });

  const wallet = WalletId.fromBase58('d4YKpiKJdUXWuRYAtdmU2FKybzAskJgsyV4XZ6wipnh');
  // const shares = await port.getShareAccount(wallet, context);
  // const portProfile = await port.getPortProfile(wallet);

  const reserve = await port.getReserve(new PublicKey('X9ByyhmtQH3Wjku9N5obPy54DbVjZV7Z99TPJZ2rwcs'));
  logAll({
    share: reserve.share,
    total: reserve.getTotalAsset().getWrapped().toU64().toString(),
    mintTotalSupply: reserve.share.getIssuedShare().getWrapped().toU64().toString(),
    // portProfile,
  });
}

main();
