import { NFT, Pool, Network, TurbosSdk, MathUtil } from 'turbos-clmm-sdk';
import { logAll } from '@/lib/utils/log-all';

async function main() {
  const sdk = new TurbosSdk(Network.mainnet);
  const poolSdk = new Pool(sdk);

  const poolObject = await poolSdk.getPool('0x5eb2dfcdd1b15d2021328258f6d5ec081e9a0cdcfa9e13a0eaeb9b5f7505ca78');
  logAll(poolObject);
}

main();
