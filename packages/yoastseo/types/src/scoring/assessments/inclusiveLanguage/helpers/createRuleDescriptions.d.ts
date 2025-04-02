/**
 * Creates a rule description for phrases that are only targeted when preceded by specific words.
 *
 * @param {string[]} precedenceExceptionList The list of words that should precede the non-inclusive phrase.
 *
 * @returns {string} The rule description.
 */
export function isPreceded(precedenceExceptionList: string[]): string;
/**
 * Creates a rule description for phrases that are targeted unless preceded by specific words.
 *
 * @param {string[]} precedenceExceptionList  The list of words that shouldn't precede the non-inclusive phrase.
 *
 * @returns {string} The rule description.
 */
export function notPreceded(precedenceExceptionList: string[]): string;
/**
 * Creates a rule description for phrases that are targeted unless followed by specific words.
 *
 * @param {string[]} followingExceptionList  The list of words that shouldn't follow the non-inclusive phrase.
 *
 * @returns {string} The rule description.
 */
export function notFollowed(followingExceptionList: string[]): string;
/**
 * Creates a rule description for phrases that are targeted unless followed or preceded by specific words.
 *
 * @param {string[]} precedenceExceptionList  The list of words that shouldn't precede the non-inclusive phrase.
 * @param {string[]} followingExceptionList  The list of words that shouldn't follow the non-inclusive phrase.
 *
 * @returns {string} The rule description.
 */
export function notPrecededAndNotFollowed(precedenceExceptionList: string[], followingExceptionList: string[]): string;
export const nonInclusiveWhenStandalone: "Targeted when followed by a participle, a function word (other than a noun), or punctuation.";
