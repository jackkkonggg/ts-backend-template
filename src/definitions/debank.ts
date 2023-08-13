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
    stats: object;
    tag_ids: string[];
    tvl: number;
  }
}
