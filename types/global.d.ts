import { Logger } from 'pino';

export declare global {
  var latest: number;
  var __MONGO_URI__: string;
  var metric_init = false;
  var pino_init: Logger<any>;
}
