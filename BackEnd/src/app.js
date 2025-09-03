import authR from './routes/auth.routes.js';
import urlR from './routes/url.routes.js'
import express from 'express'

const router = express.Router();

// Mount auth routes under /api/auth
router.use('/api/auth', authR);

// Mount URL routes under /api/url
router.use('/api/url', urlR);

// Mount URL routes at root for public redirect functionality
// This allows /:shortcode to work for public redirects
router.use('/', urlR);

export default router;