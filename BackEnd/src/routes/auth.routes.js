import express from 'express'
import { register,login } from '../controllers/auth.controller.js'

const router = express.Router();

// Authentication routes (mounted under /api/auth)
router.post('/register', register);
router.post('/login', login);

export default router;