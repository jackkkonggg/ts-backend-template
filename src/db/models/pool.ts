import { DataTypes, ModelDefined } from 'sequelize';
import { sequelize } from '../sequelize';

export interface PoolAttributes {
  id: string;
  adapterId: string;
  chain: string;
  controller: string;
  investmentType: string;
  projectId: string;
  stats: Record<string, any>;
  raw: object;
}

export const Pool: ModelDefined<PoolAttributes, PoolAttributes> =
  sequelize.define(
    'Pool',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      adapterId: {
        type: DataTypes.STRING,
      },
      chain: {
        type: DataTypes.STRING,
      },
      controller: {
        type: DataTypes.STRING,
      },
      investmentType: {
        type: DataTypes.STRING,
      },
      projectId: {
        type: DataTypes.STRING,
      },
      stats: {
        type: DataTypes.JSONB,
      },
      raw: {
        type: DataTypes.JSONB,
      },
    },
    {
      tableName: 'pool',
      underscored: true,
      createdAt: false,
      updatedAt: false,
    },
  );
