import { DataTypes, ModelDefined } from 'sequelize';
import { sequelize } from '../sequelize';

interface ProtocolAttributes {
  id: string;
  chain: string;
  logo: string;
  siteUrl: string;
  poolStats: object;
  tagIds: string[];
  raw: object;
}

export const Protocol: ModelDefined<ProtocolAttributes, ProtocolAttributes> =
  sequelize.define(
    'Note',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      chain: {
        type: DataTypes.STRING,
      },
      logo: {
        type: DataTypes.STRING,
      },
      siteUrl: {
        type: DataTypes.STRING,
      },
      poolStats: {
        type: DataTypes.JSONB,
      },
      tagIds: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      raw: {
        type: DataTypes.JSONB,
      },
    },
    {
      tableName: 'protocol',
      underscored: true,
      createdAt: false,
      updatedAt: false,
    },
  );
