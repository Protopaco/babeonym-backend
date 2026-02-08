import { Router } from "express";
const router = Router();
import { logger } from "../../../utils/logger";
import getHealth from "../../../db/getHealth.js";

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check
 *     description: Returns service health status.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

router.get("/", async (req, res) => {
  logger.info("Received health check request");
  const healthStatus = await getHealth();
  if (healthStatus.status === "ok") {
    res.status(200).json(healthStatus);
  } else {
    res.status(503).json(healthStatus);
  }
});

export default router;
