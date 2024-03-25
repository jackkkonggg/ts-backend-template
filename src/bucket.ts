import { bcs } from '@mysten/sui.js/bcs';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions';
import { BucketClient } from 'bucket-protocol-sdk';
import { logAll } from './lib/utils/log-all';

const user = '0x6112b5cfdc8ca0db16e212ff1481bac2850be48e0e56697105251f8f7e60f8cd';
const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
const buck = new BucketClient('mainnet', user);
const AF_OBJS = {
  pool: '0xeec6b5fb1ddbbe2eb1bdcd185a75a8e67f52a5295704dd73f3e447394775402b',
  poolRegistry: '0xfcc774493db2c45c79f688f88d28023a3e7d98e4ee9f48bbf5c7990f651577ae',
  protocolFeeVault: '0xf194d9b1bcad972e45a7dd67dd49b3ee1e3357a00a50850c52cd51bb450e13b4',
  treasury: '0x28e499dff5e864a2eafe476269a4f5035f1c16f338da7be18b103499abf271ce',
  insuranceFund: '0xf0c40d67b078000e18032334c3325c47b9ec9f3d9ae4128be820d54663d14e3b',
  referralVault: '0x35d35b0e5b177593d8c3a801462485572fc30861e6ce96a55af6dc4730709278',
};

const CETUS_OBJS = {
  poolBuckUsdc: '0x6ecf6d01120f5f055f9a605b56fd661412a81ec7c8b035255e333c664a0c12e7',
  globalConfig: '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f',
};

const CHUNK_SIZE = 8192;
export function toB64(bytes: Uint8Array): string {
  // Special-case the simple case for speed's sake.
  if (bytes.length < CHUNK_SIZE) {
    return btoa(String.fromCharCode(...bytes));
  }

  let output = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.slice(i, i + CHUNK_SIZE);
    output += String.fromCharCode(...chunk);
  }

  return btoa(output);
}

export function coinFromBalance(tx: TransactionBlock, coinType: string, balanceInput: TransactionArgument) {
  return tx.moveCall({
    target: '0x2::coin::from_balance',
    typeArguments: [coinType],
    arguments: [balanceInput],
  });
}

async function unstakeAf() {
  const tx = new TransactionBlock();
  const [afLpBalance, rewardBalance] = tx.moveCall({
    target: '0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake',
    typeArguments: [
      '0xf1b901d93cc3652ee26e8d88fff8dc7b9402b2b2e71a59b244f938a140affc5e::af_lp::AF_LP',
      '0x2::sui::SUI',
    ],
    arguments: [
      tx.sharedObjectRef({
        objectId: '0x0000000000000000000000000000000000000000000000000000000000000006',
        mutable: false,
        initialSharedVersion: 1,
      }),
      tx.object('0x885e09419b395fcf5c8ee5e2b7c77e23b590e58ef3d61260b6b4eb44bbcc8c62'),
      tx.object('0xe8e7ba7e4df75ffd167bc89f765363b3e7981bde1616a3e67373a57817e98fb3'),
    ],
  });

  const afLpCoin = coinFromBalance(
    tx,
    '0xf1b901d93cc3652ee26e8d88fff8dc7b9402b2b2e71a59b244f938a140affc5e::af_lp::AF_LP',
    afLpBalance,
  );
  const rewardCoin = coinFromBalance(tx, '0x2::sui::SUI', rewardBalance);

  const [buckCoin, usdcCoin] = tx.moveCall({
    target: '0xefe170ec0be4d762196bedecd7a065816576198a6527c99282a2551aaa7da38c::withdraw::all_coin_withdraw_2_coins',
    typeArguments: [
      '0xf1b901d93cc3652ee26e8d88fff8dc7b9402b2b2e71a59b244f938a140affc5e::af_lp::AF_LP',
      '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK',
      '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    ],
    arguments: [
      tx.object(AF_OBJS.pool),
      tx.object(AF_OBJS.poolRegistry),
      tx.object(AF_OBJS.protocolFeeVault),
      tx.object(AF_OBJS.treasury),
      tx.object(AF_OBJS.insuranceFund),
      tx.object(AF_OBJS.referralVault),
      afLpCoin,
    ],
  });

  const built = await tx.build({ client: suiClient as any, onlyTransactionKind: true });
  logAll({
    afLpBalance,
    rewardBalance,
    afLpCoin,
    rewardCoin,
    buckCoin,
    usdcCoin,
    args: [
      tx.object(AF_OBJS.pool),
      tx.object(AF_OBJS.poolRegistry),
      tx.object(AF_OBJS.protocolFeeVault),
      tx.object(AF_OBJS.treasury),
      tx.object(AF_OBJS.insuranceFund),
      tx.object(AF_OBJS.referralVault),
      afLpCoin,
    ],
  });
  logAll(JSON.stringify(Array.from(built)));
  logAll(toB64(built));
  const res = await suiClient.devInspectTransactionBlock({ transactionBlock: tx as any, sender: user });
  // logAll(res);
  console.log(res.results[0].returnValues[0][0]);
  console.log(bcs.u64().parse(Uint8Array.from(res.results[0].returnValues[0][0])));
  console.log(res.results[0].returnValues[1][0]);
  console.log(bcs.u64().parse(Uint8Array.from(res.results[0].returnValues[1][0])));
}

async function unstakeCetus() {
  const tx = new TransactionBlock();

  const [bucketusOut, suiReward] = tx.moveCall({
    target: '0x02139a2e2ccb61caf776b76fbcef883bdfa6d2cbe0c2f1115a16cb8422b44da2::fountain_core::force_unstake',
    typeArguments: [
      '0x8d1aee27f8537c06d19c16641f27008caafc42affd2d2fb7adb96919470481ec::bucketus::BUCKETUS',
      '0x2::sui::SUI',
    ],
    arguments: [
      tx.sharedObjectRef({
        objectId: '0x0000000000000000000000000000000000000000000000000000000000000006',
        mutable: false,
        initialSharedVersion: 1,
      }),
      tx.object('0xb9d46d57d933fabaf9c81f4fc6f54f9c1570d3ef49785c6b7200cad6fe302909'),
      tx.object('0x125e34c91e07a71c268a860cb2da8f109014c29c1d0a3804fc8ae787e92b0ec3'),
    ],
  });

  const bucketusCoin = coinFromBalance(
    tx,
    '0x8d1aee27f8537c06d19c16641f27008caafc42affd2d2fb7adb96919470481ec::bucketus::BUCKETUS',
    bucketusOut,
  );

  const suiCoin = coinFromBalance(tx, '0x2::sui::SUI', suiReward);

  const [buckCoin, usdcCoin] = tx.moveCall({
    target: '0x8da48ef1e49dcb81631ce468df5c273d2f8eb5770af4d27ec2f1049bc8a61f75::bucketus::withdraw',
    typeArguments: [
      '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK',
      '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    ],
    arguments: [
      tx.sharedObjectRef({
        objectId: '0x781d3060afe9f5427bb865088ab25c8d827ed2b0be71ab140ff9ab5a0d8c9466',
        initialSharedVersion: 61707529,
        mutable: true,
      }),
      tx.sharedObjectRef({
        objectId: '0x6edfc992f6e775fe926a5e850661c151ad01e6149e9b34792a2102e1721065fc',
        initialSharedVersion: 75359688,
        mutable: true,
      }),
      tx.sharedObjectRef({
        objectId: '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f',
        initialSharedVersion: 1574190,
        mutable: false,
      }),
      tx.sharedObjectRef({
        objectId: '0x81fe26939ed676dd766358a60445341a06cea407ca6f3671ef30f162c84126d5',
        initialSharedVersion: 74445428,
        mutable: true,
      }),
      tx.sharedObjectRef({
        objectId: '0x0000000000000000000000000000000000000000000000000000000000000006',
        mutable: false,
        initialSharedVersion: 1,
      }),
      bucketusCoin,
    ],
  });

  const built = await tx.build({ client: suiClient as any, onlyTransactionKind: true });
  logAll(JSON.stringify(Array.from(built)));
  // logAll(toB64(built));
  // const res = await suiClient.devInspectTransactionBlock({ transactionBlock: tx as any, sender: user });
  // logAll(res);
}

async function getRewards() {
  const txb = new TransactionBlock();
  txb.moveCall({
    typeArguments: [
      '0xf1b901d93cc3652ee26e8d88fff8dc7b9402b2b2e71a59b244f938a140affc5e::af_lp::AF_LP',
      '0x2::sui::SUI',
    ],
    target: '0x8f16cb934fa0c4ad403ac3fddaab8585a642f2073a47a32215a77448c3e353c6::fountain_core::get_reward_amount',
    arguments: [
      txb.object('0x885e09419b395fcf5c8ee5e2b7c77e23b590e58ef3d61260b6b4eb44bbcc8c62'),
      txb.object('0xe8e7ba7e4df75ffd167bc89f765363b3e7981bde1616a3e67373a57817e98fb3'),
      txb.pure.u64(new Date().getTime()),
    ],
  });

  txb.setSender(user);
  const results = await suiClient.devInspectTransactionBlock({
    transactionBlock: txb,
    sender: user,
  });

  console.log(results.results[0].returnValues[0][0]);
  console.log(bcs.u64().parse(Uint8Array.from(results.results[0].returnValues[0][0])));
}

async function main() {
  await unstakeCetus();
}

main();
