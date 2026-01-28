
import dotenv from 'dotenv';
import express from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger.js';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import { fileURLToPath } from 'url';
import { swaggerSpec } from './utils/swagger/swaggerSpec.js';
// import { getUser } from './utils/db/user.js';
import { pool } from './utils/dbController.js';

import baseRoute from './routes/v1/base.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PgStore = pgSession(session);
const app = express();

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: '/swagger-dark.css',
}));

app.use(
    cors({
        origin: [
            'http://localhost:4200', // Development
            'https://babeonym.com', // Your domain
            'https://api.babeonym.com', // API subdomain
            'https://www.babeonym.com', // www version
            'https://babeonym.vercel.app', // Vercel subdomain
            process.env.FRONTEND_BASE_URL, // Environment variable
        ].filter(Boolean) as string[], // Remove undefined values
        credentials: true,
    })
);

app.use(
    session({
        store: new PgStore({
            pool: pool,
            tableName: 'user_sessions',
        }),
        secret: process.env.SESSION_SECRET || 'your_secret_change_in_production',
        resave: false,
        saveUninitialized: false,
        //cookie: cookieConfig, // Use the config object here
    })
);

app.use('/swagger-dark.css', express.static(path.join(__dirname, '/utils/swagger/swagger-dark.css')));

app.get("/openapi.json", (req, res) => { res.json(swaggerSpec); });

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const server = app.listen(PORT, HOST, () => {
    console.log(`API server running at http://${HOST}:${PORT}`);
    console.log(`Swagger docs at http://${HOST}:${PORT}/api/docs`);
});

app.use('', baseRoute);

app.use(express.json());
app.use(pinoHttp({ logger }));

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Graceful shutdown...`);
    server.close(() => {
        console.log('HTTP server closed.');
        pool.end(() => {
            console.log('Database pool closed.');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


export default app;
