import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { pinoHttp } from "pino-http";
import { logger } from "./utils/logger.js";
import pgSession from "connect-pg-simple";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerSpec } from "./utils/swagger/swaggerSpec.js";
import { pool } from "./utils/dbController.js";
import * as client from "openid-client";
import { Strategy as OidcStrategy } from "openid-client/passport";

//middleware
import mapErrorResponse from "./middleware/mapErrorResponse.js";

//Routes
import baseRoute from "./routes/v1/base.js";
import authRoute from "./routes/v1/auth/index.js";
import referenceRoute from "./routes/v1/reference/index.js";
import userRoute from "./routes/v1/user/index.js";
import givenNameRoute from "./routes/v1/givenName/index.js";

//Models
import User from "./models/User.js";
import getUser from "./db/getUser.js";
import getUserByForeignId from "./db/getUserByForeignId.js";
import AuthProvider from "./models/AuthProvider.js";

const basePath = "/api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PgStore = pgSession(session);
const app = express();

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: "/swagger-dark.css",
  }),
);
app.get("/openapi.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use(
  cors({
    origin: [
      "http://localhost:4200", // Development
      "https://babeonym.com", // Your domain
      "https://api.babeonym.com", // API subdomain
      "https://www.babeonym.com", // www version
      "https://babeonym.vercel.app", // Vercel subdomain
      process.env.FRONTEND_BASE_URL, // Environment variable
    ].filter(Boolean) as string[], // Remove undefined values
    credentials: true,
  }),
);
// Configure Google OAuth strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_BASE_URL}/api/v1/auth/google/callback`,
        scope: ["openid", "email"],
      },
      async (accessToken, refreshToken, profile: Profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile?.emails?.[0]?.value;

          let user = await getUserByForeignId(googleId, AuthProvider.GOOGLE);

          // Check if user is null, undefined, or false (no user found)
          if (!user || user === null) {
            logger.info("New user detected, returning new user flag");
            return done(null, { isNewUser: true, googleId, email });
          }

          logger.info("Existing user found, logging in");
          return done(null, { ...user, isNewUser: false });
        } catch (error) {
          logger.error(error, "Error in Google OAuth strategy");
          return done(error, undefined);
        }
      },
    ),
  );
} else {
  console.warn(
    "Google OAuth not configured. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required.",
  );
}

const initMicrosoftAuth = async () => {
  if (
    !process.env.MICROSOFT_CLIENT_ID ||
    !process.env.MICROSOFT_CLIENT_SECRET
  ) {
    console.warn("Microsoft OAuth not configured.");
    return;
  }

  const tenant = process.env.MICROSOFT_TENANT || "common";

  const config = await client.discovery(
    new URL(`https://login.microsoftonline.com/${tenant}/v2.0`),
    process.env.MICROSOFT_CLIENT_ID,
    process.env.MICROSOFT_CLIENT_SECRET,
  );

  passport.use(
    "microsoft",
    new OidcStrategy(
      {
        config,
        scope: "openid profile email",
        callbackURL: `${process.env.BACKEND_BASE_URL}/api/v1/auth/microsoft/callback`,
      },
      async (tokens, done) => {
        try {
          const claims = tokens.claims();

          const microsoftId = claims?.sub;
          const email =
            (claims as any)?.email ||
            (claims as any)?.preferred_username ||
            (claims as any)?.upn;

          if (!microsoftId)
            return done(new Error("Missing Microsoft subject"), undefined);

          const user = await getUserByForeignId(
            microsoftId,
            AuthProvider.MICROSOFT,
          );

          if (!user) return done(null, { isNewUser: true, microsoftId, email });

          return done(null, { ...user, isNewUser: false });
        } catch (e) {
          return done(e as Error, undefined);
        }
      },
    ),
  );
};

app.set("trust proxy", 1);

app.use(
  session({
    store: new PgStore({ pool, tableName: "user_sessions" }),
    secret: process.env.SESSION_SECRET! || "your_secret_change_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV == "production",
      sameSite: "lax",
      httpOnly: true,
    },
  }),
);

passport.serializeUser((user, done) => {
  try {
    // Create a clean, serializable user object
    if (!user || typeof user !== "object" || !("id" in user)) {
      throw new Error("Invalid user object for serialization");
    }
    done(null, user.id);
  } catch (error) {
    logger.error(error, "Error during user serialization");
    done(error, null);
  }
});

passport.deserializeUser(async (userId: number, done) => {
  logger.debug(`Deserializing user with ID: ${userId}`);
  const userFromDb = await getUser(userId);
  if (!userFromDb) {
    logger.error(`User with ID ${userId} not found during deserialization`);
    return done(new Error("User not found"), null);
  }
  logger.debug(userFromDb);
  done(null, userFromDb);
});

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

const server = app.listen(PORT, HOST, () => {
  logger.info(`API server running at http://${HOST}:${PORT}`);
  logger.info(`Swagger docs at http://${HOST}:${PORT}/api/docs`);
  app.use(mapErrorResponse);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(basePath, baseRoute);
app.use(`${basePath}/v1/auth/`, authRoute);
app.use(`${basePath}/v1/givenName/`, givenNameRoute);
app.use(`${basePath}/v1/reference/`, referenceRoute);
app.use(`${basePath}/v1/user/`, userRoute);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Graceful shutdown...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    pool.end(() => {
      logger.info("Database pool closed.");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
