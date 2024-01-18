import { GaugeData } from './gauge-data';
import { PoolData } from './pool-data';

export interface ApiResponse<T> {
  data: T;
  generatedTimeMs: number;
  success: boolean;
}

export type CurvePoolResponse = ApiResponse<{
  poolData: PoolData[];
}>;

export type GetVolumeResponse = ApiResponse<{
  poolList: Array<{
    address: string;
    type: string;
  }>;
}>;

export type CurveGaugeResponse = ApiResponse<Record<string, GaugeData>>;

export const poolTypeMap = {
  main: 'main', // address_provider => get_registry => PoolAdded
  crypto: 'crypto', // address_provider => get_address(id) => PoolAdded
  'stable-factory': 'factory', // factory
  'factory-crvusd': 'factory-crvusd', // crvusd_factory
  'factory-crypto': 'factory-crypto', // crypto_factory
  'factory-eywa': 'factory-eywa', // eywa_factory
  'factory-tricrypto': 'factory-tricrypto', // tricrypto_factory
  'factory-stable-ng': 'factory-stable-ng', // stable_ng_factory
};

export const poolFactoryKeyMap = {
  main: 'address_provider',
  crypto: 'address_provider',
  'factory-stable': 'factory',
  'factory-crvusd': 'crvusd_factory',
  'factory-crypto': 'crypto_factory',
  'factory-eywa': 'eywa_factory',
  'factory-tricrypto': 'tricrypto_factory',
  'factory-stable-ng': 'stable_ng_factory',
  'gauge-factory': 'gauge_factory',
  'gauge-controller': 'gauge_controller',
};
