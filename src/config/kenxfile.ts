import { config } from './config';

export const knexConfig = {
  ...config.database,
  migrations: {
    tableName: 'migrations',
    directory: '../migrations',
    extensions: ['ts'],
  },
};

module.exports = knexConfig;
