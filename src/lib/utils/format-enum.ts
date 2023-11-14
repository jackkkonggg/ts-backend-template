import { OKXPoolData } from '@/definitions/pool-data';
import { indentLevel } from './indent-level';

export function formatEnum(okxChainId: string, poolDataList: OKXPoolData[]): string {
  return `
${indentLevel(1)}CURVE_${okxChainId}_LP(Arrays.asList(
            ${poolDataList.map((pd) => `"${pd.lpTokenAddress}"`).join(`,\n${indentLevel(3)}`)}
${indentLevel(1)})),

${indentLevel(1)}CURVE_${okxChainId}_POOL(Arrays.asList(
            ${poolDataList.map((pd) => `"${pd.factory}"`).join(`,\n${indentLevel(3)}`)}
${indentLevel(1)})),

${indentLevel(1)}CURVE_${okxChainId}_DEPOSIT(Arrays.asList(
            ${poolDataList.map((pd) => `"${pd.gauge}"`).join(`,\n${indentLevel(3)}`)}
${indentLevel(1)})),
`;
}
