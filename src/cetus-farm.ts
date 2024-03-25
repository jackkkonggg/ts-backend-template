import { TransactionBlock } from '@mysten/sui.js/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { logAll } from './lib/utils/log-all';

const suiClient = new SuiClient({ url: 'https://rpc-mainnet.suiscan.xyz:443' });

async function getRewards() {
  const package_id = '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526';
  const globalConfig = '0x21215f2f6de04b57dd87d9be7bb4e15499aec935e36078e2488f36436d64996e';
  const RewardManager = '0xe0e155a88c77025056da08db5b1701a91b79edb6167462f768e387c3ed6614d5';
  const farm = '0x9f5fd63b2a2fd8f698ff6b7b9720dbb2aa14bedb9fc4fd6411f20e5b531a4b89';
  const CLOCK_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000006';
  const wrapped_position_id = '0x26786799a53eaa3281d61a304964521b251d8a4af2a0f3bd85d6ef52122badb6';
  const sender = '0x6112b5cfdc8ca0db16e212ff1481bac2850be48e0e56697105251f8f7e60f8cd';

  const txb = new TransactionBlock();
  txb.moveCall({
    target: `${package_id}::router::harvest`,
    arguments: [
      txb.object(globalConfig),
      txb.object(RewardManager),
      txb.object(farm),
      txb.object(wrapped_position_id),
      txb.object(CLOCK_ADDRESS),
    ],
    typeArguments: ['0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI'],
  });

  txb.setSender(sender);
  const transactionBlock = await txb.build({ client: suiClient });
  // const res = await suiClient.devInspectTransactionBlock({
  //   sender,
  //   transactionBlock,
  // });
  const res = await suiClient.dryRunTransactionBlock({ transactionBlock });
  logAll(res.events);
  return;
}

async function getRewarder() {
  const package_id = '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526';
  const globalConfig = '0x21215f2f6de04b57dd87d9be7bb4e15499aec935e36078e2488f36436d64996e';
  const RewardManager = '0xe0e155a88c77025056da08db5b1701a91b79edb6167462f768e387c3ed6614d5';
  const farm = '0x9f5fd63b2a2fd8f698ff6b7b9720dbb2aa14bedb9fc4fd6411f20e5b531a4b89';
  const CLOCK_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000006';
  const wrapped_position_id = '0x26786799a53eaa3281d61a304964521b251d8a4af2a0f3bd85d6ef52122badb6';
  const sender = '0x6112b5cfdc8ca0db16e212ff1481bac2850be48e0e56697105251f8f7e60f8cd';

  const txb = new TransactionBlock();
  const [rewarder] = txb.moveCall({
    target: `${package_id}::rewarder::borrow_rewarder`,
    arguments: [txb.object(RewardManager)],
    typeArguments: ['0x2::sui::SUI'],
  });

  txb.moveCall({
    target: `${package_id}::rewarder::emission_per_second`,
    arguments: [rewarder],
  });

  txb.setSender(sender);
  const transactionBlock = await txb.build({ client: suiClient });
  const res = await suiClient.devInspectTransactionBlock({
    sender,
    transactionBlock,
  });
  // const res = await suiClient.dryRunTransactionBlock({ transactionBlock });
  logAll(res);
  return;
}

getRewarder();
