import { http_request_duration_milliseconds } from '../index.js';

export function endTiming(req, res, next) {
  const responseTime = Date.now() - res.locals.startEpoch;
  //console.log('end', req.path, responseTime);
  http_request_duration_milliseconds
  .labels(req.method, req.path, res.statusCode)
  .observe(responseTime);
  next();
}
