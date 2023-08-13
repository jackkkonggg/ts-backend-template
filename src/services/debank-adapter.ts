import { DeBank } from '@/definitions/debank';
import axios from 'axios';

export class DebankAdapter {
  public static async getProtocolList(): Promise<DeBank.Protocol> {
    const { data } = await axios.get<DeBank.ProtocolResponse>(
      'https://api.debank.com/protocol/list',
      {
        params: {
          start: 0,
          limit: 10000,
          chain_id: '',
          pool_name: '',
          q: '',
          order_by: '-deposit_usd_value',
        },
      },
    );

    return data.data.protocols;
  }

  public static async getPools({
    start = 0,
    limit = 20,
    name = '',
    id,
  }: DeBank.PoolParams) {
    const { data } = await axios.get<DeBank.PoolResponse>(
      'https://api.debank.com/protocol/pools',
      {
        params: {
          start,
          limit,
          name,
          id,
        },
      },
    );

    return data.data.pools;
  }
}
