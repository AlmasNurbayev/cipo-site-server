import { http_request_duration_milliseconds, httpRequestCounter } from '../index.js';

export function endTiming(req, res, next) {
  const responseTime = Date.now() - res.locals.startEpoch;
  http_request_duration_milliseconds
  .labels(req.method, req.path, res.statusCode, req.originalUrl)
  .observe(responseTime);

  httpRequestCounter.inc({
    method: req.method,
    statusCode: res.statusCode,
    route: req.path,
    originalUrl: req.originalUrl,
  });
  next();
}
