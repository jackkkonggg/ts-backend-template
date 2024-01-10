import { utils } from '@coral-xyz/anchor';
import { Wallet, loadKeypair, DriftClient, getUserAccountPublicKeySync, BN } from '@drift-labs/sdk';
import { PDAUtil } from '@orca-so/whirlpools-sdk';
import { LarixMarkets, LarixUserInfo } from '@projectlarix/larix-sdk';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { logAll } from './lib/utils/log-all';

const connection = new Connection(
  // 'https://solana-mainnet.g.alchemy.com/v2/DZRZbJnzrSkBB7LrEyhJ2uNAq9NEsyIW',
  'https://api.mainnet-beta.solana.com',
  'confirmed',
);

async function main() {
  const userAddress = new PublicKey('dJtmJvMXYJUBJc8NcAWSKLUU9x3437k2eKpJ4mJDVsp');
  const larixMarket = new LarixMarkets(connection);
  await larixMarket.loadReservesAndRewardApy();
  const larixUserInfo = new LarixUserInfo(userAddress, connection, larixMarket.markets);
  await larixUserInfo.loadUserInfo();
  larixUserInfo.marketDetails.forEach((detail) => {
    detail.mining?.detail.forEach((miningDetail) => {
      console.log(
        'mining marketDetails' +
          '\nmarket: ' +
          detail.market.config.name +
          '\nreserve: ' +
          miningDetail.reserve.reserveConfig.name +
          '\nminingAmount: ' +
          miningDetail.amount.toString() +
          '\nminingValue: ' +
          miningDetail.value.toString(),
      );
    });
  });
  await larixUserInfo.loadTokenAccounts();
  larixUserInfo.bindTokenAccountToReserve();
  larixUserInfo.markets.forEach((market) => {
    market.reserves.forEach((reserve) => {
      if (reserve.userLiquidityAmount.isGreaterThan(0)) {
        console.log(
          'user token balance' +
            '\nmarket: ' +
            market.config.name +
            '\nreserve: ' +
            reserve.reserveConfig.name +
            '\nuserLiquidityTokenAmount: ' +
            reserve.userLiquidityAmount.toString(),
        );
      }
    });
  });
}

main();
