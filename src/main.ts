import { sequelize } from '@/db/sequelize';
import { Db } from '@/db/models';
import { wait } from '@/lib/utils/wait';
import { DebankAdapter } from '@/services/debank-adapter';
import { sortBy } from 'lodash';
import { readFile } from 'fs/promises';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // const protocols = JSON.parse(
  //   (await readFile('output/protocol-list.json')).toString(),
  // );
  const protocols = (await Db.Protocol.findAll()).map(
    ({ dataValues }) => dataValues,
  );

  for (const protocol of sortBy(protocols, 'id')) {
    console.log(protocol.id);
    // await Db.Protocol.create({
    //   id: protocol.id,
    //   chain: protocol.chain,
    //   logo: protocol.logo_url,
    //   siteUrl: protocol.site_url,
    //   poolStats: protocol?.stats?.pool_stats,
    //   tagIds: protocol.tag_ids,
    //   raw: protocol,
    // });
    const isProcessed = Boolean(
      await Db.Pool.findOne({ where: { projectId: protocol.id } }),
    );

    if (isProcessed) {
      console.info(`${protocol.id} has already been processed`);
      continue;
    }

    const pools = await DebankAdapter.getPools(protocol.id);
    for (const p of pools) {
      try {
        await Db.Pool.create({
          adapterId: p.adapter_id,
          chain: p.chain,
          controller: p.controller,
          investmentType: p.name,
          projectId: p.project_id,
          stats: p.stats,
          raw: p,
        });
      } catch (e) {
        console.warn(e);
      }
    }
    console.log(`${protocol.id} -> ${pools.length} pools`);
    await wait(1);
  }

  await sequelize.close();
}

main();
