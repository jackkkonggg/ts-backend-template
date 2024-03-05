import { logAll } from '@/lib/utils/log-all';
import { Decimal } from 'decimal.js-light';

const tick = -19477681;
const liquidity = 3100500963381461;

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

async function main() {
  const sqrt_ratio = sqrt_ratio_x128;
  const ratio = sqrt_ratio.pow(2);
  console.log({
    tick,
    sqrt_ratio: sqrt_ratio.toString(),
    ratio: ratio.toString(),
  });
}

main();
