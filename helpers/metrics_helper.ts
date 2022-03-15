import Prometheus, { Histogram } from 'prom-client';

function createMetric() {
  return new Prometheus.Histogram({
    name: 'minitwit_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['route', 'path', 'status_code', 'method'],
    buckets: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  });
}

export default createMetric;
