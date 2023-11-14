export const curveChains = {
  1: 'ethereum',
  10: 'optimism',
  100: 'xdai',
  137: 'polygon',
  250: 'fantom',
  324: 'zksync',
  1284: 'moonbeam',
  2222: 'kava',
  8453: 'base',
  42220: 'celo',
  43114: 'avalanche',
  42161: 'arbitrum',
  1313161554: 'aurora',
} as Record<string, string>;

export const okxChains = {
  1: 'ETH',
  56: 'BSC',
  66: 'OKC',
  137: 'POLY',
  43114: 'AVAX',
  42161: 'ARB',
  250: 'FTM',
  10: 'OP',
  1030: 'CFX',
  324: 'ZKSYNC_ERA',
  1116: 'CORE',
  5000: 'MANTLE',
  8453: 'BASE',
  1101: 'POLYGON_ZKEVM',
  534352: 'SCROLL',
  59144: 'LINEA',
  100: 'GNOSIS',
  204: 'OPBNB',
  169: 'MANTA',
} as Record<string, string>;

export function getCommonChains() {
  const okxChainIds = Object.keys(okxChains);
  const commonChainIds = okxChainIds.filter((chainId) => curveChains[chainId] != null);

  const entries = commonChainIds.map((chainId) => [chainId, [curveChains[chainId], okxChains[chainId]]]);
  return Object.fromEntries(entries);
}
