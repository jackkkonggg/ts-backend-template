import { TransactionBlock } from '@mysten/sui.js';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

const suiClient = new SuiClient({ url: 'https://rpc-mainnet.suiscan.xyz:443' });

async function main() {
  const package_id = '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526';
  const globalConfig = '0x21215f2f6de04b57dd87d9be7bb4e15499aec935e36078e2488f36436d64996e';
  const RewardManager = '0xe0e155a88c77025056da08db5b1701a91b79edb6167462f768e387c3ed6614d5';
  const clmm_position = '0xc00dc4dd15f2135024f14bf2ce14b95ef4320dc9295e29183410ceaa2a8c450b';
  const farm = '0x9f5fd63b2a2fd8f698ff6b7b9720dbb2aa14bedb9fc4fd6411f20e5b531a4b89';
  const CLOCK_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000006';
  const wrapped_position_id = '0xfea52ae3ad1c505e461b67b6801691811d0a10077440845520dfea58709cf3d4';

  const txb = new TransactionBlock();
  txb.moveCall({
    target: `${package_id}::router::accumulated_position_rewards`,
    arguments: [
      txb.object(globalConfig),
      txb.object(RewardManager),
      txb.object(farm),
      txb.object(wrapped_position_id),
      txb.object(CLOCK_ADDRESS),
    ],
    // typeArguments: [
    //   // '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526::config::GlobalConfig',
    //   // '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526::rewarder::RewarderManager',
    //   // '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526::pool::Pool',
    // ],
  });
  txb.setSender('0x812dbad4db09b2c4c363339b305597fdfe166f15d7092c93e49cad85b9c563e0');
  txb.setGasBudget(300_000_000);
  txb.setGasPrice(1000);
  const transactionBlock = await txb.build({ client: suiClient });
  const res = await suiClient.dryRunTransactionBlock({ transactionBlock });
  console.log('res:', res);
  console.log('rewarder:', res.events[0].parsedJson);
  console.log('only simulate...');
  return;
}

main();
