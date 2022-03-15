import metrics_helper from '../helpers/metrics_helper';

export declare global {
  var latest: Number;
  var initialized: boolean = false;
  var metrics: Object = {
    httpRequestDurationMilliseconds = metrics_helper(),
  };
}
