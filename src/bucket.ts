import { bcs } from '@mysten/sui.js/bcs';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { BucketClient } from 'bucket-protocol-sdk';
import { logAll } from './lib/utils/log-all';

const user = '0x6112b5cfdc8ca0db16e212ff1481bac2850be48e0e56697105251f8f7e60f8cd';
const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
const buck = new BucketClient('mainnet', user);

async function unstake() {
  const proof = await buck.getUserLpProofs(user);
  const userLpProof = proof['0x885e09419b395fcf5c8ee5e2b7c77e23b590e58ef3d61260b6b4eb44bbcc8c62'][0];
  const tx = await buck.getAfUnstakeTx(
    '0x885e09419b395fcf5c8ee5e2b7c77e23b590e58ef3d61260b6b4eb44bbcc8c62',
    userLpProof,
    user,
  );

  // tx.setSender(user);
  // const built = await tx.build({ client: suiClient as any });
  const res = await suiClient.devInspectTransactionBlock({ transactionBlock: tx as any, sender: user });
  logAll(res);
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
  await unstake();
}

main();
