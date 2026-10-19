/*
 * Word-boundary building blocks for patterns built from phrase lists (like the`redundantPhraseInAltText` configs).
 * JavaScript's `\b` and `\w` only know ASCII word characters: to `\b`, a Greek or Arabic word followed by a space is
 * no boundary at all, and a word ending in "å" or "ć" never passes it. These guards use Unicode property escapes instead,
 * so one definition works for every script alike. A pattern using them MUST carry the `u` flag — without it,
 * `\p{L}` silently matches the literal letter "p".
 */

// Ends a word or phrase: the next character may not be a letter, digit or underscore.
export const wordEnd = "(?![\\p{L}\\p{N}_])";

// Starts a word: the start of the text, or anything that is not a letter, digit or underscore.
export const wordStart = "(?:^|[^\\p{L}\\p{N}_])";

// A single letter in any script, for requiring that a word follows.
export const letter = "\\p{L}";
