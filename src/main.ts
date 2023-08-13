import { sequelize } from '@/db/sequelize';
import { Db } from '@/db/models';

async function main() {
  console.log('main');

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const protocols = await Db.Protocol.findAll();
  for (const { dataValues: protocol } of protocols) {
    console.log(protocol);
  }

  await sequelize.close();
}

main();
