export function startTiming(req, res, next) {
  res.locals.startEpoch = Date.now();
  //console.log('start',req.path, res.locals.startEpoch);
  next();
}