/**
 * Cleans up a user-typed custom given name before it is stored or matched.
 *
 * Only ever adds capitals. Nothing is lowercased, so a deliberate spelling
 * survives: McKenna stays McKenna, and JOHN stays JOHN. That means an all-caps
 * name keeps its capitals when it matches no canonical name — the case-
 * insensitive lookup in add_custom_given_name is what turns JOHN into John,
 * by deferring to the canonical spelling rather than by rewriting the input.
 *
 * A segment starts at the beginning of the string or after a space or hyphen, so
 * anne-marie becomes Anne-Marie.
 *
 * An apostrophe deliberately does not start a segment: da'ar has to come out as
 * Da'ar, not Da'Ar. The cost is that d'angelo stays D'angelo rather than being
 * corrected to D'Angelo. That is the conservative direction — under-capitalize
 * and let the user type what they meant, rather than impose a capital on a name
 * that did not want one.
 *
 * Letters are matched as \p{L} rather than a-z so accented and non-Latin
 * letters are capitalized rather than skipped.
 */
export default (customGivenName: string): string =>
  customGivenName
    .trim()
    .replace(/\s+/gu, " ")
    .replace(
      /(^|[\s-])(\p{L})/gu,
      (_match, boundary: string, letter: string) =>
        boundary + letter.toUpperCase(),
    );
