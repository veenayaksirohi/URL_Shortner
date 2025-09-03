import express from 'express';
import router from './src/app.js';
import logger from './src/utils/logger.js';
import errorHandler from './src/middleware/errorHandler.js';

// If you have custom wrappers:
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'; // Correct import!
import cors from 'cors';
import compression from 'compression';

const app = express();
const port = process.env.PORT || 3000;

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mount your authentication and URL routes
app.use('/', router);

// Centralized error handler (must be after routes)
app.use(errorHandler);

app.listen(port, () => {
  logger.info({ port }, `Server listening on http://localhost:${port}`);
});
