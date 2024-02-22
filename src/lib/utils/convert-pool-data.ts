import { OKXPoolData, PoolData } from '@/definitions/pool-data';

export function convertPoolData(pd: PoolData): OKXPoolData {
  return {
    factory: pd.address.toLowerCase(),
    lpTokenAddress: pd.lpTokenAddress.toLowerCase(),
    gauge: (pd.gaugeAddress ?? '').toLowerCase(),
  };
}

export function convertPoolDataV2(chain: string, chainId: number, pd: PoolData) {
  return {
    chain,
    chainId,
    id: pd.id,
    pool: pd.address.toLowerCase(),
    lpTokenAddress: pd.lpTokenAddress.toLowerCase(),
    type: pd.poolType,
    gauge: (pd.gaugeAddress ?? '').toLowerCase(),
  };
}

export type TargetPoolData = {
  chain: string;
  chainId: number;
  id: string;
  pool: string;
  lpTokenAddress: string;
  type: string;
  gauge: string;
};
