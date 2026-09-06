import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import User from "../models/User";

/**
 * A ceiling on how often one caller may reach the API.
 *
 * Set well above real use rather than close to it. A busy user peaks at roughly
 * two requests a second while swiping, and mutations are serialised on the
 * client, so they are round-trip bound rather than free-running. 300 a minute
 * leaves about ten times that headroom.
 *
 * A one-minute window is what makes a separate per-second rule unnecessary. An
 * opening page load fires five or six requests at once — the session, the user,
 * the filters, the approved list, the first candidates — and any per-second cap
 * low enough to be worth having would catch that burst on a first visit.
 *
 * Counted per user where there is one, and per address otherwise. Address alone
 * would be wrong: carrier and office NAT put many unrelated people behind one
 * of them, so a handful of real users swiping together would exhaust a shared
 * budget and see the app fail for no fault of their own.
 *
 * Deliberately not req.sessionID. saveUninitialized is false, so a request that
 * carries no cookie is handed a newly generated session id, and keying off that
 * would give a caller who simply never sends a cookie an unlimited supply of
 * empty buckets. req.user is only set once passport has deserialised a session
 * that actually exists, which is the property this needs. passport.session() is
 * registered before the routers this guards, so it has run by the time this
 * does.
 *
 * That leaves an abuser buying budget by collecting sessions, which is what
 * anonymousSessionRateLimit exists to stop: sessions can only be created thirty
 * an hour per address, so the number of buckets one address can hold is capped
 * even though each bucket is generous.
 *
 * ipKeyGenerator rather than req.ip directly because the library rejects a raw
 * address here — IPv6 hands out whole subnets to one subscriber, so addresses
 * have to be normalised to a prefix or the limit is trivially sidestepped.
 *
 * The store is in memory, so it resets on deploy and counts per process. Behind
 * more than one Railway instance the effective ceiling is multiplied by the
 * instance count. Acceptable — this bounds cheap abuse, it is not a guarantee,
 * and volumetric attacks are an edge concern this cannot reach anyway.
 */
export default rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Try again shortly." },
  keyGenerator: (req) =>
    req.user
      ? `user:${(req.user as User).id}`
      : ipKeyGenerator(req.ip ?? "unknown"),
});
