import { AccountType, getConfig, MarginfiClient, MarginfiAccount } from '@mercurial-finance/marginfi-client-v2';
import { NodeWallet } from '@mrgnlabs/mrgn-common';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { logAll } from './lib/utils/log-all';

const main = async () => {
  const connection = new Connection(
    'https://solana-mainnet.g.alchemy.com/v2/DZRZbJnzrSkBB7LrEyhJ2uNAq9NEsyIW',
    'confirmed',
  );
  const wallet = NodeWallet.local();
  const config = getConfig();
  const client = await MarginfiClient.fetch(config, wallet, connection);
  // const accounts = await client.getMarginfiAccountsForAuthority('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY');
  const marginFiPublicKey = 'HgXZcUHdfNLxELXBRMq6eyV23GqPYzjCUCTmCSKVEWb5'; // accounts[0].publicKey;
  const marginfiAccount = await MarginfiAccount.fetch(marginFiPublicKey, client);
  const bank = marginfiAccount.group.getBankByMint(new PublicKey('So11111111111111111111111111111111111111112'));
  const balance = marginfiAccount.getBalance(new PublicKey('CCKtUs6Cgwo4aaQUmBPmyoApH2gUDErxNZCAntD6LYGh'));
  logAll({
    balance,
    assetShares: balance.assetShares.toString(),
    liabilityShares: balance.liabilityShares.toString(),
    marginfiAccount,
  });
  // logAll(bank);
  // logAll(marginfiAccount.describe());
};

main();
