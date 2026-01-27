import { Request, Response, NextFunction } from 'express';

export default function setCookie(req: Request, res: Response, next: NextFunction): void {
  const environment = process.env.NODE_ENV || 'development';

  if (environment === 'production') {
    res.removeHeader('Set-Cookie');
    const sessionValue = encodeURIComponent(req.sessionID);
    let cookieString = `connect.sid=${sessionValue}; Path=/; HttpOnly; Secure; Domain=.babeonym.com; SameSite=none; Max-Age=86400`;
    res.setHeader('Set-Cookie', cookieString);
  }
  next();
}
