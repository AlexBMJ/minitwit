import Prometheus, { Histogram } from 'prom-client';

async function httpRequestDurationMilliseconds() {
  return (
    (await Prometheus.register.getMetricsAsArray()).find((v) => v.name === 'minitwit_request_duration_ms') ||
    new Prometheus.Gauge({
      name: 'minitwit_request_duration_ms',
      help: 'Duration of HTTP requests in ms',
      labelNames: ['route', 'status_code', 'method'],
    })
  );
}

export default httpRequestDurationMilliseconds;
