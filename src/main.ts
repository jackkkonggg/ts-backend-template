import { curveChains, getCommonChains } from '@/definitions/blockchains';
import { TargetPoolData, convertPoolDataV2 } from '@/lib/utils/convert-pool-data';
import axios from 'axios';
import {
  CurveGaugeResponse,
  CurvePoolResponse,
  GetVolumeResponse as GetSubgraphResponse,
  poolTypeMap,
} from '@/definitions/curve';
import { writeFile } from 'fs/promises';

async function processPool(chainIds: number[]) {
  const convertedPoolData: TargetPoolData[] = [];
  for (const chainId of chainIds) {
    const [curveId, okxId] = getCommonChains()[chainId];
    const apiPaths = Object.values(poolTypeMap);
    console.log({ curveId, okxId });

    const { data: subgraphResponse } = await axios.get<GetSubgraphResponse>(
      `https://api.curve.fi/api/getSubgraphData/${curveId}`,
    );

    const allPools = subgraphResponse.data.poolList;
    if (allPools instanceof Array) {
      for (const pool of allPools) {
        const isValidType = pool.type in poolTypeMap;
        if (!isValidType) {
          console.log(pool);
        }
      }
    }

    const poolData = (
      await Promise.all(
        apiPaths.map(async (path) => {
          const { data: poolResponse } = await axios.get<CurvePoolResponse>(
            `https://api.curve.fi/api/getPools/${curveId}/${path}`,
          );
          console.debug(`GET /getPools/${curveId}/${path} poolCount=${poolResponse.data.poolData.length}`);
          return poolResponse.data.poolData.map((pd) => {
            pd.poolType = path === 'factory' ? 'factory-stable' : path;
            return pd;
          });
        }),
      )
    ).flat();
    convertedPoolData.push(...poolData.map((pd) => convertPoolDataV2(curveId, chainId, pd)));
  }
  // console.log(convertedPoolData);

  console.log(
    convertedPoolData.filter((c) => c.chain === 'fantom' && c.pool === '0x3ef6a01a0f81d6046290f3e2a8c5b843e738e604'),
  );

  const {
    data: { data: gaugeData },
  } = await axios.get<CurveGaugeResponse>('https://api.curve.fi/api/getAllGauges');
  for (const gd of Object.values(gaugeData)) {
    const poolUrls = [gd.poolUrls.swap, gd.poolUrls.deposit, gd.poolUrls.withdraw].flat();
    const chain =
      Object.entries(curveChains).find(([key, value]) => {
        return poolUrls.some((url) => url.includes(value));
      })?.[1] ?? null;

    const index = convertedPoolData.findIndex(
      (pd) =>
        pd.pool === gd.swap.toLowerCase() && pd.lpTokenAddress === gd.swap_token.toLowerCase() && pd.chain === chain,
    );

    if (index >= 0) {
      const pd = convertedPoolData[index];
      console.debug(`Adjusting Gauge at id=${pd.id} pool=${gd.swap} lpTokenAddress=${gd.swap_token} gauge=${gd.gauge}`);
      convertedPoolData[index].gauge = gd.gauge.toLowerCase();
    }
    //  else if (index >= 0 && convertedPoolData[index].gauge !== '') {
    //   const pd = convertedPoolData[index];
    //   console.debug(`Pool with 2 gauges at id=${pd.id} pool=${gd.swap} lpTokenAddress=${gd.swap_token} gaugeA=${gd.gauge} guageB=${convertedPoolData[index].gauge}`)
    // }
  }

  const filteredPoolData: TargetPoolData[] = [];
  const keys = new Set<string>();
  for (const poolData of convertedPoolData) {
    const key = `${poolData.chainId}-${poolData.pool}`;
    if (keys.has(key)) {
      const index = filteredPoolData.findIndex((p) => p.chainId === poolData.chainId && p.pool === poolData.pool);
      // console.log({
      //   existing: filteredPoolData[index],
      //   current: poolData,
      //   replace: filteredPoolData[index].gauge == '',
      // });
      if (filteredPoolData[index].gauge == '') {
        filteredPoolData.splice(index, 1);
        filteredPoolData.push(poolData);
      }
    } else {
      filteredPoolData.push(poolData);
      keys.add(key);
    }
  }

  await writeFile('curve_pools.json', JSON.stringify(filteredPoolData, null, 4));

  // for (const pd of convertedPoolData) {
  //   const formatted = `${`${curveId.toUpperCase()}_${pd.id
  //     .toUpperCase()
  //     .split('-')
  //     .join('_')}`}(BlockChain.${okxId}, PoolType.${toEnumCase(pd.type)}, "${pd.id}", "${pd.pool}", "${
  //     pd.lpTokenAddress
  //   }", "${pd.gauge}"),`;
  // }

  // const txtContent = convertedPoolData
  //   .map(
  //     (pd) =>
  //       `${`${curveId.toUpperCase()}_${pd.id
  //         .toUpperCase()
  //         .split('-')
  //         .join('_')}`}(BlockChain.${okxId}, PoolType.${toEnumCase(pd.type)}, "${pd.id}", "${pd.pool}", "${
  //         pd.lpTokenAddress
  //       }", "${pd.gauge}"),`,
  //   )
  //   .join('\n    ');
  // await writeFile(`${curveId}_pools.txt`, txtContent);
}

processPool([1, 56, 43114, 137, 10, 250, 42161, 8453, 100]);
