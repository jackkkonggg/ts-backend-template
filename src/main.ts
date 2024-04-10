import { Decimal } from 'decimal.js-light';
import { logAll } from '@/lib/utils/log-all';

// A fixed point .128 number has at most 128 bits after the decimal,
// which translates to about 10**38.5 in decimal.
// That means ~78 decimals of precision should be able to represent
// any price with full precision.
// Note there can be loss of precision for intermediate calculations,
// but this should be sufficient for just computing the price.
Decimal.set({ precision: 78 });

const tick = 812;
const Q128 = new Decimal(2).pow(128);
const Q32 = new Decimal(2).pow(32);
const sqrt_ratio_x128 = new Decimal('1.000000499999875000062499960937527343729492203613268157969894399906166456215526')
  .pow(tick)
  .mul(Q128);
const actual_sqrt_ratio = 340420665893103510219797445980775776256n;
console.log({
  actual_sqrt_ratio,
  sqrt_ratio_x128: sqrt_ratio_x128.toString(),
  math: new Decimal(actual_sqrt_ratio.toString()).div(Q128).toString(),
});

const liquidity = new Decimal(61836261554);

async function main() {
  const sqrt_ratio_x96 = sqrt_ratio_x128.div(Q32);
  const sqrt_ratio = sqrt_ratio_x128.div(Q128);
  const ratio = sqrt_ratio.pow(2);
  const x = liquidity.div(sqrt_ratio);
  const y = liquidity.mul(sqrt_ratio);
  console.log({
    tick,
    x: x.toString(),
    y: y.toString(),
    sqrt_ratio: sqrt_ratio.toString(),
    ratio: ratio.toString(),
    sqrt_ratio_x96: sqrt_ratio_x96.toDecimalPlaces(0).toString(),
  });
}

main();
