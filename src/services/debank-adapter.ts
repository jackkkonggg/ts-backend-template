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

  public static async getPools(id: string) {
    const limit = 20;
    const pools: DeBank.Pool[] = [];
    const {
      data: { data },
    } = await axios.get<DeBank.PoolResponse>(
      'https://api.debank.com/protocol/pools',
      {
        params: {
          start: 0,
          limit,
          name: '',
          id,
        },
      },
    );
    pools.push(...data.pools);

    const pages = Math.min(10, Math.ceil(data.total_count / limit));
    for (let i = 1; i < pages; ++i) {
      const {
        data: { data },
      } = await axios.get<DeBank.PoolResponse>(
        'https://api.debank.com/protocol/pools',
        {
          params: {
            start: i * limit,
            limit,
            name: '',
            id,
          },
        },
      );
      console.log(`${id} - Page ${i}`);
      pools.push(...data.pools);
    }

    return pools;
  }
}
