import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
  // log structured error
  logger.error({ err, path: req.path, body: req.body }, 'Unhandled error');

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // send JSON error response
  res.status(status).json({
    error: {
      message,
      status,
    },
  });
}
