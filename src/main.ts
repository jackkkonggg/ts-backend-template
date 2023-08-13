import axios from 'axios';
import { saveToOutput } from '@/lib/utils/save-to-output';
import { DeBank } from '@/definitions/debank';

async function main() {
  console.log('main');
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

  console.log({ data });
  saveToOutput(
    'output/protocol-list.json',
    JSON.stringify(data.data.protocols),
  );
}

main();
