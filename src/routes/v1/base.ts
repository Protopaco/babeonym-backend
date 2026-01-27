import express from 'express';
import { pool } from '../../utils/dbController.js';

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     operationId: getRoot
 *     tags: [Health]
 *     summary: Health check for API
 *     responses:
 *       200:
 *         description: Returns a simple "I'm here" message
 */
router.get('/', (req, res) => {
  res.send("I'm here");
});

/**
 * @swagger
 * /health:
 *   get:
 *     operationId: getHealthCheck
 *     tags: [Health]
 *     summary: Detailed health check including database
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: errorMessage,
    });
  }
});

export default router;
