import { OKXPoolData, PoolData } from '@/definitions/pool-data';

export function convertPoolData(pd: PoolData): OKXPoolData {
  return {
    factory: pd.address.toLowerCase(),
    lpTokenAddress: pd.lpTokenAddress.toLowerCase(),
    gauge: (pd.gaugeAddress ?? '').toLowerCase(),
  };
}
