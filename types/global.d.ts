import { Gauge } from "prom-client";


export declare global {
  var __MONGO_URI__: string;
  var latest: Number;
  var guahhges: Gauge<T>[] = [];
}
