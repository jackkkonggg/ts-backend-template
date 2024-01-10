import { Connection, PublicKey } from '@solana/web3.js';
import { SolendMarket, SolendAction, ObligationCollateralLayout, WAD } from '@solendprotocol/solend-sdk';
import BN from 'bn.js';
import { logAll } from './lib/utils/log-all';

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

async function main() {
  const obligationAccount = await PublicKey.createWithSeed(
    new PublicKey('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY'),
    '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY'.slice(0, 32),
    new PublicKey('So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo'),
  );
  console.log({
    obligationAccount,
    seed: '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY'.slice(0, 32),
    span: ObligationCollateralLayout.span,
  });

  const market = await SolendMarket.initialize(connection, 'production');
  const reserve = market.reserves.find((r) => r.config.address === '8PbodeaosQP19SjYFx855UMqWxH2HynZLdBXmsrbac36');
  await reserve.load();
  console.log({ WAD });
  logAll(reserve);
  const obligation = await market.fetchObligationByWallet(
    new PublicKey('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY'), // user's address
  );

  logAll(obligation);
}

async function deposit() {
  const connection = new Connection(process.env.MAINNET_RPC_URL, 'confirmed');
  const amountBase = new BN(1);
  const symbol = 'USDC';
  const publicKey = new PublicKey('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY');

  await SolendAction.buildDepositTxns(connection, amountBase, symbol, publicKey, 'production');
}

main();
