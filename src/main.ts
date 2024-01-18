import { getCommonChains } from '@/definitions/blockchains';
import { convertPoolDataV2 } from '@/lib/utils/convert-pool-data';
import axios from 'axios';
import {
  CurveGaugeResponse,
  CurvePoolResponse,
  GetVolumeResponse as GetSubgraphResponse,
  poolFactoryKeyMap,
  poolTypeMap,
} from '@/definitions/curve';
import factoryData from './factory_data.json';
import { toEnumCase } from './lib/utils/case-format';
import { writeFile } from 'fs/promises';

async function processFactoryData() {
  console.log(Object.keys(poolFactoryKeyMap));
  Object.entries(factoryData).forEach(([key, value]) => {
    // console.log(key);
    // console.log(value);
    console.log(`
    ${key}(BlockChain.${key}, new HashMap<String, PoolType>(){{
        ${Object.keys(poolFactoryKeyMap)
          .map((factoryType) => {
            const pool: string = value[poolFactoryKeyMap[factoryType]] ?? '0x0000000000000000000000000000000000000000';
            return `put("${pool.toLowerCase()}", PoolType.${toEnumCase(factoryType)});`;
          })
          .join('\n        ')}
    }}),
    `);
  });
}

// processFactoryData();

async function processPool(chainIds: number[]) {
  const convertedPoolData = [];
  for (const chainId of chainIds) {
    const [curveId, okxId] = getCommonChains()[chainId];
    const apiPaths = Object.values(poolTypeMap);
    console.log({ curveId, okxId });

    const { data: subgraphResponse } = await axios.get<GetSubgraphResponse>(
      `https://api.curve.fi/api/getSubgraphData/${curveId}`,
    );
    // console.log(getVolumeResponse);
    const allPools = subgraphResponse.data.poolList;
    for (const pool of allPools) {
      const isValidType = pool.type in poolTypeMap;
      if (!isValidType) {
        console.log(pool);
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

  const {
    data: { data: gaugeData },
  } = await axios.get<CurveGaugeResponse>('https://api.curve.fi/api/getAllGauges');
  for (const gd of Object.values(gaugeData)) {
    const index = convertedPoolData.findIndex(
      (pd) => pd.pool === gd.swap.toLowerCase() && pd.lpTokenAddress === gd.swap_token.toLowerCase(),
    );
    if (index > 0 && convertedPoolData[index].gauge === '') {
      const pd = convertedPoolData[index];
      console.debug(`Adjusting Gauge at id=${pd.id} pool=${gd.swap} lpTokenAddress=${gd.swap_token} gauge=${gd.gauge}`);
      convertedPoolData[index].gauge = gd.gauge.toLowerCase();
    }
  }

  await writeFile('curve_pools.json', JSON.stringify(convertedPoolData, null, 4));

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

processPool([1, 43114, 137, 10, 250, 42161, 8453, 100]);
