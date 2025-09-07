import app from './app.js';
import logger from './src/utils/logger.js';

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  logger.info({ port }, `Server listening on http://0.0.0.0:${port}`);
});

