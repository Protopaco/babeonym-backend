import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user) {
    logger.debug(req.user, "Authenticated access granted");
    return next();
  }
  logger.debug("Unauthenticated access attempt");
  return res.status(401).json({ message: "Not authenticated" });
}
