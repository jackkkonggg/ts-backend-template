import { getCommonChains } from '@/definitions/blockchains';
import { convertPoolData } from '@/lib/utils/convert-pool-data';
import axios from 'axios';
import { CurveGaugeResponse, CurvePoolResponse } from '@/definitions/curve';
import { formatEnum } from '@/lib/utils/format-enum';

async function main(chainId: number) {
  const [curveId, okxId] = getCommonChains()[chainId];
  const apiPaths = ['main', 'factory-crypto', 'crypto', 'factory-tricrypto', 'factory'];
  console.log({ curveId, okxId });

  const poolData = (
    await Promise.all(
      apiPaths.map(async (path) => {
        const { data } = await axios.get<CurvePoolResponse>(`https://api.curve.fi/api/getPools/${curveId}/${path}`);
        console.debug(`GET /getPools/${curveId}/${path} poolCount=${data.data.poolData.length}`);
        return data.data.poolData;
      }),
    )
  ).flat();
  const convertedPoolData = poolData.map(convertPoolData);

  const {
    data: { data: gaugeData },
  } = await axios.get<CurveGaugeResponse>('https://api.curve.fi/api/getAllGauges');
  for (const gd of Object.values(gaugeData)) {
    const index = convertedPoolData.findIndex(
      (pd) => pd.factory === gd.swap.toLowerCase() && pd.lpTokenAddress === gd.swap_token.toLowerCase(),
    );
    if (index > 0 && convertedPoolData[index].gauge === '') {
      console.debug(
        `Adjusting Gauge at index=${index} factory=${gd.swap} lpTokenAddress=${gd.swap_token} gauge=${gd.gauge}`,
      );
      convertedPoolData[index].gauge = gd.gauge.toLowerCase();
    }
  }
  console.log(formatEnum(okxId, convertedPoolData));
}

main(100);
