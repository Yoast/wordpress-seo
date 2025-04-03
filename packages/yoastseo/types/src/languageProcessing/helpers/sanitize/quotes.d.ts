declare namespace _default {
    export { normalizeSingleQuotes as normalizeSingle };
    export { normalizeDoubleQuotes as normalizeDouble };
    export { normalizeQuotes as normalize };
}
export default _default;
/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
declare function normalizeSingleQuotes(text: string): string;
/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
declare function normalizeDoubleQuotes(text: string): string;
/**
 * Normalizes quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
declare function normalizeQuotes(text: string): string;
export const SINGLE_QUOTES_REGEX: RegExp;
export const SINGLE_QUOTES_ARRAY: string[];
export { normalizeSingleQuotes as normalizeSingle, normalizeDoubleQuotes as normalizeDouble, normalizeQuotes as normalize };
