/**
 * The most approved names one account may hold.
 *
 * This exists to stop a script, not to shape how anyone actually uses the app.
 * Someone naming a child shortlists tens of names, so no real user comes near
 * this; what it rules out is an account accumulating thousands. The number is
 * therefore not precise, and nothing should treat it as though it were — the
 * check that reads it is a plain count taken before the write, so two requests
 * arriving together can both pass it and leave the account a name or two over.
 * That is accepted. An account at 100 is no more expensive than one at 99; an
 * account at 10,000 is the thing worth preventing.
 *
 * 99 rather than 100 keeps a name's rank to two digits, so the Your Names rank
 * slot can be sized for two.
 *
 * The frontend carries its own copy so it can hide the affordances rather than
 * let a user walk into a rejection. If the two drift, the visible effect is
 * that the UI stops a little before or after the server refuses, which is why
 * they are allowed to be separate constants rather than shared.
 */
export default 99;
