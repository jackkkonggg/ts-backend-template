import { getCommonChains } from '@/definitions/blockchains';
import { convertPoolData } from '@/lib/utils/convert-pool-data';
import axios from 'axios';
import { CurvePoolResponse } from '@/definitions/curve';
import { formatEnum } from '@/lib/utils/format-enum';

async function main(chainId: number) {
  const [curveId, okxId] = getCommonChains()[chainId];
  const apiPaths = ['main', 'factory-crypto', 'crypto', 'factory-tricrypto', 'factory'];
  console.log({ curveId, okxId });

  const poolData = (
    await Promise.all(
      apiPaths.map(async (path) => {
        const { data } = await axios.get<CurvePoolResponse>(`https://api.curve.fi/api/getPools/${curveId}/${path}`);
        console.debug(`curveId=${curveId} path=${path} pools=${data.data.poolData.length}`);
        return data.data.poolData;
      }),
    )
  ).flat();
  const convertedPoolData = poolData.map(convertPoolData);
  console.log(formatEnum(okxId, convertedPoolData));
}

main(250);
