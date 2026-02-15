import * as migration_20260214_152643 from './20260214_152643';
import * as migration_20260215_144800 from './20260215_144800';

export const migrations = [
  {
    up: migration_20260214_152643.up,
    down: migration_20260214_152643.down,
    name: '20260214_152643',
  },
  {
    up: migration_20260215_144800.up,
    down: migration_20260215_144800.down,
    name: '20260215_144800'
  },
];
