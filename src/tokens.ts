import { writeFile } from 'fs/promises';
import tokenList from './token-list.json';

async function main() {
  const textContent = (tokenList as any[]).map((t) => `('${t.address}', "${t.name}", "${t.symbol}", ${t.decimals})`);

  await writeFile(
    'solana-token-list.sql',
    `INSERT INTO solana_token(mint, name, symbol, decimals)
VALUES ${textContent.join(',\n       ')}
  `,
  );
}

main();
