export namespace DeBank {
  export interface Data<D> {
    _cache_seconds: number;
    _seconds: number;
    _use_cache: boolean;
    error_code: number;
    data: D;
  }

  export type ProtocolResponse = Data<{
    protocols: Protocol;
    total_count: number;
  }>;

  export interface Protocol {
    chain: string;
    coin: object;
    dao_id: string;
    id: string;
    is_tvl: boolean;
    is_visible_in_defi: string;
    logo_url: string;
    name: string;
    platform_token_chain: string;
    platform_token_id: string;
    platform_token_symbol: string;
    site_url: string;
    stats: Record<string, any>;
    tag_ids: string[];
    tvl: number;
  }

  export interface PoolParams {
    start?: number;
    limit?: number;
    id: string;
    name?: string;
  }

  export interface Pool {
    adapter_id: string;
    chain: string;
    controller: string;
    id: string;
    index: string | null;
    name: string;
    project_id: string;
    stats: Record<string, any>;
  }

  export type PoolResponse = Data<{
    pools: Pool[];
    total_count: number;
  }>;
}
