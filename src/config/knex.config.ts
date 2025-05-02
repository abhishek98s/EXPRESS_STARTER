import { config } from './config';
import knex from 'knex';

const knexConfig = {
  ...config.database,
};

export default knex(knexConfig);
