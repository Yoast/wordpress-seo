import { punctuationRegexString } from "yoastseo/src/languageProcessing/helpers/sanitize/removePunctuation";

const symbols = "#$%&*+/=@^`{|}~\u00a0-\u00bf\u2013-\u204a\u2000-\u206f\u20a0-\u20c0";
/**
 * This regular expression includes the punctuation list from yoastseo plus additional common symbols.
 * @type {RegExp}
 */
const punctuationRegEx = new RegExp( "[" + punctuationRegexString + symbols + "]", "g" );

/**
 * @param {string} string The string to check.
 * @returns {boolean} Whether the string is considered empty.
 */
export const isConsideredEmpty = string => string.replace( punctuationRegEx, "" ).trim().length === 0;
