import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';

export const auth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify and decode JWT
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach payload to request object
    next(); // Pass to next middleware/route handler
  } catch (error) {
    logger.error({ err: error }, 'JWT verification failed');
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
