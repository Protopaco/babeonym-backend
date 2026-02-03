import { DatabaseError } from "pg";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export default (err: unknown, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    if (err instanceof DatabaseError) {
        // Handle specific database errors based on the code
        switch (err.code) {
            case '23505': // unique_violation
                return res.status(409).json({ error: "db_error", message: 'Conflict: Duplicate entry' });
            case '23503': // foreign_key_violation
                return res.status(400).json({ error: "db_error", message: 'Bad Request: Foreign key violation' });
            case '23502': // not_null_violation
                return res.status(400).json({ error: "db_error", message: 'Bad Request: Not null violation' });
            default:
                return res.status(500).json({ error: "db_error", message: 'Internal Server Error' });
        }
    }

    // If it's not a DatabaseError, return a generic server error
    return res.status(500).json({ error: "server_error", message: 'Internal Server Error' });
}