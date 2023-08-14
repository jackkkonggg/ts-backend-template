import { DataTypes, ModelDefined } from 'sequelize';
import { sequelize } from '../sequelize';

export interface PoolAttributes {
  adapterId: string;
  chain: string;
  controller: string;
  id: string;
  index: string;
  investmentType: string;
  projectId: string;
  stats: Record<string, any>;
  raw: object;
}

export const Pool: ModelDefined<PoolAttributes, PoolAttributes> =
  sequelize.define(
    'Pool',
    {
      adapterId: {
        type: DataTypes.STRING,
      },
      chain: {
        type: DataTypes.STRING,
      },
      controller: {
        type: DataTypes.STRING,
      },
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      index: {
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
