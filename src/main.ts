import { sequelize } from '@/db/sequelize';
import { readFile } from 'fs/promises';
import { Protocol } from '@/db/models/protocol';
import { DeBank } from '@/definitions/debank';

async function main() {
  console.log('main');

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const protocols = JSON.parse(
    (await readFile('output/protocol-list.json')).toString(),
  ) as DeBank.Protocol[];

  for (const protocol of protocols) {
    await Protocol.create({
      id: protocol.id,
      chain: protocol.chain,
      logo: protocol.logo_url,
      siteUrl: protocol.site_url,
      poolStats: protocol?.stats?.pool_stats,
      tagIds: protocol.tag_ids,
      raw: protocol,
    });
    console.info(`Saved ${protocol.id} - ${protocol.chain}`);
  }

  await sequelize.close();
}

main();
