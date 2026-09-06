import rateLimit from "express-rate-limit";

/**
 * A tighter ceiling on anonymous session creation.
 *
 * This endpoint mints a user row and a session with no credential and no cost,
 * which makes it the cheapest way to manufacture identities. Every other limit
 * that keys off a session is only as good as this one: without it a caller
 * simply takes a fresh session and a fresh budget with it.
 *
 * Thirty an hour rather than something stricter because of carrier NAT. A lot
 * of real first-time visitors on mobile networks share one address, and a
 * spammer needs thousands of sessions for this to be worth doing, so tightening
 * it further would cost genuine users without troubling the case it exists for.
 */
export default rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many sessions created. Try again later." },
});
