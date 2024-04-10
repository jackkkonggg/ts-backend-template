export interface GaugeData {
  isPool: boolean;
  poolUrls: {
    swap: string[];
    deposit: string[];
    withdraw: string[];
  };
  swap: string;
  swap_token: string;
  name: string;
  shortName: string;
  gauge: string;
  type: string;
  side_chain: boolean;
  factory: boolean;
  gauge_data: {
    inflation_rate: number;
    working_supply: string;
  };
  gauge_controller: {
    gauge_relative_weight: string;
    get_gauge_weight: string;
    inflation_rate: number;
  };
  hasNoCrv: boolean;
  is_killed: boolean;
  lpTokenPrice: number;
  gaugeStatus: {
    areCrvRewardsStuckInBridge: boolean;
    rewardsNeedNudging: boolean;
  };
}
