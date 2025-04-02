declare const _default: typeof getSentenceTokenizer & import("lodash").MemoizedFunction;
export default _default;
/**
 * Returns the sentences from a certain text.
 *
 * @param {string} text 					The text to retrieve sentences from..
 * @param {boolean} [trimSentences=true] 	Whether to trim whitespace from the beginning and end of the sentences or not.
 *
 * @returns {Array<string>} The list of sentences in the text.
 */
declare function getSentenceTokenizer(text: string, trimSentences?: boolean | undefined): Array<string>;
