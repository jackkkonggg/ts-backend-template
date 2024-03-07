import { Decimal } from 'decimal.js-light';
import { logAll } from '@/lib/utils/log-all';

const tick = -19400218;

// A fixed point .128 number has at most 128 bits after the decimal,
// which translates to about 10**38.5 in decimal.
// That means ~78 decimals of precision should be able to represent
// any price with full precision.
// Note there can be loss of precision for intermediate calculations,
// but this should be sufficient for just computing the price.
Decimal.set({ precision: 78 });

const Q128 = new Decimal(2).pow(128);
const sqrt_ratio_x128 = new Decimal(
  '1.000000499999875000062499960937527343729492203613268157969894399906166456215526',
).pow(tick);
const actual_sqrt_ratio = 20851524678857110339703447681380084n;
console.log({
  actual_sqrt_ratio,
  sqrt_ratio_x128: sqrt_ratio_x128.toString(),
  math: new Decimal(actual_sqrt_ratio.toString()).div(Q128).toString(),
});
const liquidity = new Decimal(1e18);

async function main() {
  const sqrt_ratio = sqrt_ratio_x128;
  const ratio = sqrt_ratio.pow(2);
  const x = liquidity.div(sqrt_ratio);
  const y = liquidity.mul(sqrt_ratio);
  console.log({
    tick,
    x: x.toString(),
    y: y.toString(),
    sqrt_ratio: sqrt_ratio.toString(),
    ratio: ratio.toString(),
  });
}

main();
