import express from 'express'
import {shorten,allUrls,delUrls,redirect} from '../controllers/url.controller.js'
import { auth } from '../middleware/jwtMiddleware.js'
const router = express.Router();

// Protected URL management routes (mounted under /api/url)
router.post('/shorten', auth, shorten);
router.get('/urls', auth, allUrls);
router.delete('/urls/:id', auth, delUrls);

// Public redirect route (mounted at root level)
router.get('/:shortcode', redirect);

export default router;