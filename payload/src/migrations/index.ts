import * as migration_20260214_152643 from './20260214_152643';
import * as migration_20260215_144800 from './20260215_144800';
import * as migration_20260215_152717 from './20260215_152717';
import * as migration_20260215_160625 from './20260215_160625';
import * as migration_20260222_153634 from './20260222_153634';

export const migrations = [
  {
    up: migration_20260214_152643.up,
    down: migration_20260214_152643.down,
    name: '20260214_152643',
  },
  {
    up: migration_20260215_144800.up,
    down: migration_20260215_144800.down,
    name: '20260215_144800',
  },
  {
    up: migration_20260215_152717.up,
    down: migration_20260215_152717.down,
    name: '20260215_152717',
  },
  {
    up: migration_20260215_160625.up,
    down: migration_20260215_160625.down,
    name: '20260215_160625',
  },
  {
    up: migration_20260222_153634.up,
    down: migration_20260222_153634.down,
    name: '20260222_153634'
  },
];
