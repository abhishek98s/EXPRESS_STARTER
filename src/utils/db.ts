import knex from '../config/knex.config';
import { Knex } from 'knex';

export function connection(tx?: Knex) {
  return tx || knex;
}
