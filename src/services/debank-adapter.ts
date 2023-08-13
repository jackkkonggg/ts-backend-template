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
}
