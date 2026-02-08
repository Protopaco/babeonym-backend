import { Router } from "express";
const router = Router();
import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";

export default async () => {
  try {
    // Check database connection
    await pool.query("SELECT 1");
    logger.info("Database connection is healthy");
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    };
  } catch (error) {
    logger.error(error, "Health check failed");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: errorMessage,
    };
  }
};
