import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { logAll } from './lib/utils/log-all';

const umi = createUmi('https://api.mainnet-beta.solana.com');

async function fetchTokenMetadata(address: string) {
  const asset = await fetchDigitalAsset(umi, address as any);
  logAll(asset);
}

fetchTokenMetadata('BGzo1VbwHE9kSAZQ3eBkPTJmdzkD37sZGf7U5BrgzoAo');
