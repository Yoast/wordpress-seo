/**
 * Calls htmlparser2 and returns the text without HTML blocks that we do not want to consider for the content analysis.
 * Note that this function will soon be deprecated in favour of our own HTML parser.
 *
 * @param {string} text The text to parse.
 *
 * @returns {string} The text without the HTML blocks.
 */
export default function _default(text: string): string;
