import { config } from './config';

export const knexConfig = {
  ...config.database,
  migrations: {
    tableName: 'migrations',
    directory: '../migrations',
    extensions: ['ts'],
  },
  seeds: {
    tableName: 'seeds',
    directory: '../seeds',
    extensions: ['ts'],
  },
};

module.exports = knexConfig;
