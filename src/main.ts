import { Metaplex } from '@metaplex-foundation/js';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { string } from '@metaplex-foundation/umi/serializers';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { OpenOrders } from '@project-serum/serum';
import {
  TokenAccount,
  SPL_ACCOUNT_LAYOUT,
  LIQUIDITY_STATE_LAYOUT_V4,
  FARM_STATE_LAYOUT_V3,
  Liquidity,
  jsonInfo2PoolKeys,
  LiquidityPoolKeys,
  FARM_STATE_LAYOUT_V5,
  FARM_STATE_LAYOUT_V6,
  Farm,
  FarmPoolsJsonFile,
  FarmPoolJsonInfo,
  Spl,
  PoolInfoLayout,
  PositionInfoLayout,
  LiquidityMath,
  SqrtPriceMath,
  Clmm,
  s32,
  AmmConfigLayout,
  TickUtils,
  PositionUtils,
  TickArrayLayout,
  ClmmPoolInfo,
  ClmmPoolPersonalPosition,
} from '@raydium-io/raydium-sdk';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenListProvider, TokenInfo, ENV } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import BN from 'bn.js';
import { keyBy } from 'lodash';
import { logAll } from './lib/utils/log-all';

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const umi = createUmi('https://api.mainnet-beta.solana.com');
const owner = new PublicKey('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY');

async function getTokenAccounts(owner: PublicKey) {
  const tokenResp = await connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  const accounts: TokenAccount[] = [];
  for (const { pubkey, account } of tokenResp.value) {
    accounts.push({
      pubkey,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(account.data),
      programId: null,
    });
  }

  return accounts;
}

async function fetchTokenMetadata(address: string) {
  return fetchDigitalAsset(umi, address as any);
}

// raydium pool id can get from api: https://api.raydium.io/v2/sdk/liquidity/mainnet.json
export async function parsePoolInfo(poolId: string) {
  const tokenAccounts = await getTokenAccounts(owner);

  // example to get pool info
  const info = await connection.getAccountInfo(new PublicKey(poolId));
  if (!info) return;

  const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);
  const openOrders = await OpenOrders.load(
    connection,
    poolState.openOrders,
    poolState.marketProgramId, // OPENBOOK_PROGRAM_ID(marketProgramId) of each pool can get from api: https://api.raydium.io/v2/sdk/liquidity/mainnet.json
  );
  console.info({ poolState, openOrders });

  const baseTokenAmount = await connection.getTokenAccountBalance(poolState.baseVault);
  const quoteTokenAmount = await connection.getTokenAccountBalance(poolState.quoteVault);

  const basePnl = poolState.baseNeedTakePnl.toString();
  const quotePnl = poolState.quoteNeedTakePnl.toString();

  const openOrdersBaseTokenTotal = openOrders.baseTokenTotal.toString();
  const openOrdersQuoteTokenTotal = openOrders.quoteTokenTotal.toString();

  const base = Number(baseTokenAmount.value.amount) + openOrdersBaseTokenTotal - basePnl;
  const quote = Number(quoteTokenAmount.value.amount) + openOrdersQuoteTokenTotal - quotePnl;

  const addedLpAccount = tokenAccounts.find((a) => a.accountInfo.mint.equals(poolState.lpMint));
  const { data: liquidityData } = await axios.get('https://api.raydium.io/v2/sdk/liquidity/mainnet.json');
  const allLiquidity = keyBy([...liquidityData.official, ...liquidityData.unOfficial], 'id');
  const targetPoolInfo = allLiquidity[poolId];

  const { baseReserve, quoteReserve, lpSupply } = await Liquidity.fetchInfo({
    connection,
    poolKeys: jsonInfo2PoolKeys(targetPoolInfo as LiquidityPoolKeys),
  });
  console.info({
    baseVault: poolState.baseVault.toBase58(),
    quoteVault: poolState.quoteVault.toBase58(),
    baseMint: poolState.baseMint.toBase58(),
    quoteMint: poolState.quoteMint.toBase58(),
    lpTokenMint: poolState.lpMint.toBase58(),
    // baseToken: await fetchTokenMetadata(poolState.baseMint.toBase58()),
    // quoteToken: await fetchTokenMetadata(poolState.quoteMint.toBase58()),
    totalBase: base,
    totalQuote: quote,
    baseVaultBalance: baseTokenAmount.value.amount,
    quoteVaultBalance: quoteTokenAmount.value.amount,
    baseTokenDecimals: poolState.baseDecimal.toString(),
    quoteTokenDecimals: poolState.quoteDecimal.toString(),
    totalLp: poolState.lpReserve.toString(),
    addedLpAmount: addedLpAccount?.accountInfo.amount.toString() ?? 0,
    baseReserve: baseReserve.toString(),
    quoteReserve: quoteReserve.toString(),
    lpSupply: lpSupply.toString(),
  });
}

async function parseFarmInfo(farmId: string) {
  // example to get pool info
  const info = await connection.getAccountInfo(new PublicKey(farmId));
  if (!info) return;

  const { data: farmData } = await axios.get<FarmPoolsJsonFile>('https://api.raydium.io/v2/sdk/farm-v2/mainnet.json');
  const allFarms: FarmPoolJsonInfo[] = Object.keys(farmData).reduce((acc, cur) => [...acc.concat(farmData[cur])], []);
  const farmInfo = allFarms.find((farm) => farm.id === farmId)!;
  const poolKeys = jsonInfo2PoolKeys({ ...farmInfo, symbol: undefined });
  const { [farmId]: data } = await Farm.fetchMultipleInfoAndUpdate({
    connection,
    pools: [poolKeys],
    owner: new PublicKey('6vHga3QTPpd4HhXZzTXSPEakrUNNr1qsE6A21EqUfce9'),
    chainTime: Math.floor(new Date().getTime() / 1000),
  });

  logAll(JSON.parse(JSON.stringify(data)));
  // const ledgerAccount = Farm.getAssociatedLedgerAccount({
  //   programId: new PublicKey('FarmqiPv5eAj3j1GMdMCMUGXqPUvmquZtMy86QH6rzhG'),
  //   poolId: new PublicKey('8QMwMyobh8Q4tiN1k2DSbZSv1WNthRXHp9GYgVpBHBsg'),
  //   owner: new PublicKey('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY'),
  //   version: 6,
  // });
  // logAll({ ledgerAccount });

  // const farmState = FARM_STATE_LAYOUT_V6.decode(info.data);
  // console.log({
  //   validRewardTokenNum: farmState.validRewardTokenNum.toString(),
  //   rewardMultiplier: farmState.rewardMultiplier.toString(),
  //   rewardPeriodMax: farmState.rewardPeriodMax.toString(),
  //   rewardPeriodMin: farmState.rewardPeriodMin.toString(),
  //   rewardPeriodExtend: farmState.rewardPeriodExtend.toString(),
  //   lpVault: farmState.lpVault.toBase58(),
  //   lpMint: farmState.lpMint.toBase58(),
  //   creator: farmState.creator.toBase58(),
  //   rewardInfos: farmState.rewardInfos.map((ri) => ({
  //     rewardState: ri.rewardState.toString(),
  //     rewardOpenTime: ri.rewardOpenTime.toString(),
  //     rewardEndTime: ri.rewardEndTime.toString(),
  //     rewardLastUpdateTime: ri.rewardLastUpdateTime.toString(),
  //     totalReward: ri.totalReward.toString(),
  //     totalRewardEmissioned: ri.totalRewardEmissioned.toString(),
  //     rewardClaimed: ri.rewardClaimed.toString(),
  //     rewardPerSecond: ri.rewardPerSecond.toString(),
  //     accRewardPerShare: ri.accRewardPerShare.toString(),
  //     rewardVault: ri.rewardVault.toBase58(),
  //     rewardMint: ri.rewardMint.toBase58(),
  //     rewardSender: ri.rewardSender.toBase58(),
  //   })),
  // });
}

async function clmm() {
  const walletTokenAccounts = await getTokenAccounts(owner);
  const tokenAccount = walletTokenAccounts
    .filter((i) => i.accountInfo.amount.toNumber() > 0)
    .filter((i) => i.accountInfo.mint.toBase58() === 'dXdQu2ZbcXT2XRC1MisxmNgQbAN2PvFBmqbg9DVz4RG');

  const poolId = new PublicKey('61R1ndXxvsWXXkWSyNkCxnzwd3zUNB8Q2ibmkiLPC8ht');
  const poolInfoAccount = await connection.getAccountInfo(poolId);
  const poolInfo = PoolInfoLayout.decode(poolInfoAccount.data);
  // logAll(poolInfo);
  const ammConfigAccount = await connection.getAccountInfo(poolInfo.ammConfig);
  const ammConfig = AmmConfigLayout.decode(ammConfigAccount.data);
  // logAll(ammConfig);
  const personalPosition = new PublicKey('DgZAG5WaCWJfXriL8TaxbHbaDrC74WqQVb5qxjjpK3PF');
  const personalPositionAccount = await connection.getAccountInfo(personalPosition);
  const positionInfo = PositionInfoLayout.decode(personalPositionAccount.data);
  // logAll(positionInfo);

  const amounts = LiquidityMath.getAmountsFromLiquidity(
    poolInfo.sqrtPriceX64,
    SqrtPriceMath.getSqrtPriceX64FromTick(positionInfo.tickLower),
    SqrtPriceMath.getSqrtPriceX64FromTick(positionInfo.tickUpper),
    positionInfo.liquidity,
    false,
  );

  const tickArrayLowerAddress = TickUtils.getTickArrayAddressByTick(
    poolInfoAccount.owner,
    poolId,
    positionInfo.tickLower,
    poolInfo.tickSpacing,
  );

  const tickArrayUpperAddress = TickUtils.getTickArrayAddressByTick(
    poolInfoAccount.owner,
    poolId,
    positionInfo.tickUpper,
    poolInfo.tickSpacing,
  );

  const tickArrayLowerAddressAccount = await connection.getAccountInfo(tickArrayLowerAddress);
  const tickLowerState = TickArrayLayout.decode(tickArrayLowerAddressAccount.data).ticks[
    TickUtils.getTickOffsetInArray(positionInfo.tickLower, poolInfo.tickSpacing)
  ];

  const tickArrayUpperAddressAccount = await connection.getAccountInfo(tickArrayUpperAddress);
  const tickUpperState = TickArrayLayout.decode(tickArrayUpperAddressAccount.data).ticks[
    TickUtils.getTickOffsetInArray(positionInfo.tickUpper, poolInfo.tickSpacing)
  ];

  const { tokenFeeAmountA, tokenFeeAmountB } = PositionUtils.GetPositionFees(
    poolInfo as unknown as ClmmPoolInfo,
    positionInfo as unknown as ClmmPoolPersonalPosition,
    tickLowerState,
    tickUpperState,
  );

  const positionRewards = PositionUtils.GetPositionRewards(
    poolInfo as unknown as ClmmPoolInfo,
    positionInfo as unknown as ClmmPoolPersonalPosition,
    tickLowerState,
    tickUpperState,
  );

  console.info({ tokenFeeAmountA, tokenFeeAmountB, positionRewards });

  const amountA = amounts.amountA.toString();
  const amountB = amounts.amountB.toString();
  console.info({
    amountA,
    amountB,
    tickLower: positionInfo.tickLower,
    tickUpper: positionInfo.tickUpper,
    tickLowerSqrtPriceX64: SqrtPriceMath.getSqrtPriceX64FromTick(positionInfo.tickLower).toString(),
    tickUpperSqrtPriceX64: SqrtPriceMath.getSqrtPriceX64FromTick(positionInfo.tickUpper).toString(),
  });
}

function mulRightShift(val: BN, mulBy: BN): BN {
  return signedRightShift(val.mul(mulBy), 64, 256);
}

function signedRightShift(n0: BN, shiftBy: number, bitWidth: number) {
  const twoN0 = n0.toTwos(bitWidth).shrn(shiftBy);
  twoN0.imaskn(bitWidth - shiftBy + 1);
  return twoN0.fromTwos(bitWidth - shiftBy);
}

// parsePoolInfo('5vYSdPpR3xAimtmumM37akVYKXRZ8yaTkjckRxd3WKpr');
// parseFarmInfo('CHYrUBX2RKX8iBg7gYTkccoGNBzP44LdaazMHCLcdEgS');
clmm();

const toBinary = (n: BN) => {
  return n
    .toArray()
    .map((i) => i.toString(2).padStart(8, '0'))
    .join('');
};
const a = new BN('18445821805675395072');
const b = new BN('18444899583751176192');
console.log(a.mul(b).toTwos(256).shrn(64).toString(2));
console.log(new BN('193').toString(2));
console.log(a.mul(b).toTwos(256).shrn(64).maskn(193).toString(2));
