import { GaugeData } from './gauge-data';
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

export type CurveGaugeResponse = ApiResponse<Record<string, GaugeData>>;
