import { sum } from 'lodash';
import { Namespace } from '@/definitions/namespace';

async function main() {
  console.log('main');
  const a = [1, 2, 3, 4, 5];
  const hi: Namespace.Hi = { hi: 'hi' };
  console.log({ sum: sum(a), hi });
}

main();
