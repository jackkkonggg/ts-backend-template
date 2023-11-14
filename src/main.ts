import { getCommonChains } from '@/definitions/blockchains';
import { convertPoolData } from '@/lib/utils/convert-pool-data';
import axios from 'axios';
import { CurvePoolResponse } from '@/definitions/curve';

async function main() {
  console.log(getCommonChains());
  const {
    data: {
      data: { poolData },
    },
  } = await axios.get<CurvePoolResponse>('https://api.curve.fi/api/getPools/base/factory');
  const convertedPoolData = poolData.map(convertPoolData);
  console.log(convertedPoolData);
}

main();
