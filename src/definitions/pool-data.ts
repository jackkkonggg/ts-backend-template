export interface PoolData extends Partial<GaugeData> {
  id: string;
  address: string;
  coinsAddresses: string[];
  decimals: string[];
  virtualPrice: string;
  amplificationCoefficient: string;
  totalSupply: string;
  name: string;
  assetType: string;
  implementationAddress: string;
  symbol: string;
  poolUrls: {
    swap: string[];
    deposit: string[];
    withdraw: string[];
  };
  implementation: string;
  lpTokenAddress: string;
  assetTypeName: string;
  coins: {
    address: string;
    usdPrice: number;
    decimals: string;
    isBasePoolLpToken: boolean;
    symbol: string;
    poolBalance: string;
  }[];
  usdTotal: number;
  isMetaPool: boolean;
  usdTotalExcludingBasePool: number;
  usesRateOracle: boolean;
  isBroken: boolean;
}

export interface GaugeData {
  gaugeAddress: string;
  gaugeRewards: {
    gaugeAddress: string;
    tokenPrice: number;
    name: string;
    symbol: string;
    decimals: string;
    apy: number;
    metaData: {
      rate: string;
      periodFinish: number;
    };
    tokenAddress: string;
  }[];
  gaugeCrvApy: number[];
}

export interface OKXPoolData {
  factory: string;
  lpTokenAddress: string;
  gauge: string;
}
