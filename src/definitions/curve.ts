import { PoolData } from './pool-data';

export interface ApiResponse<T> {
  data: T;
  generatedTimeMs: number;
  success: boolean;
}

export type CurvePoolResponse = ApiResponse<{
  poolData: PoolData[];
  tvl: number;
  tvlAll: number;
}>;
