import { NextFunction, Request, Response } from "express";


export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};
