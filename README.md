# Babeonym backend

The API behind [Babeonym](https://www.babeonym.com), an app that helps parents choose a baby name by comparing names two at a time.

Babeonym is three repositories:

- [babeonym-frontend](https://github.com/Protopaco/babeonym-frontend): the React app.
- **babeonym-backend**: this API.
- [babeonym-setup](https://github.com/Protopaco/babeonym-setup): the PostgreSQL schema and the pipeline that builds the name data.

## What it does

- Serves name candidates, search and filters from the name data.
- Records each choice and comparison, and keeps each person's ranked list.
- Lets people add their own names.
- Signs people in with Google, or as an anonymous guest who can sign in later to keep their progress.
- Limits request rates, overall and for anonymous sessions.

## Built with

Node 20+, TypeScript, Express 5, PostgreSQL, Passport and openid-client for sign-in, sessions stored in PostgreSQL, Pino for logging, and Swagger for the API docs. Tested with Vitest and Supertest.

## Running it

1. Build the database with [babeonym-setup](https://github.com/Protopaco/babeonym-setup).
2. Copy `.env-example` to `.env` and fill it in: the database connection, a session secret, Google sign-in credentials, and the frontend and backend URLs.
3. `npm install`
4. `npm start`

`npm start` writes the OpenAPI spec to `src/docs/openapi.json`, then starts the server. The API docs are served at `/api/docs`.

## Tests

The tests run against a real database, so build one with babeonym-setup and point `.env` at it first.

```
npm test
```

## Layout

- `src/routes/v1`: one file per endpoint, grouped into auth, givenName, user, reference and health.
- `src/db`: one file per database call.
- `src/middleware`: the sign-in check, rate limits and error mapping.
- `src/utils/swagger`: the OpenAPI schemas.
