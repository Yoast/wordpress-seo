export default getClausesSplitOnStopWords;
/**
 * Splits the sentence into clauses based on stopwords.
 *
 * @param {string} sentence The text to split into clauses.
 * @param {Object} options The language-specific regexes and Clause class.
 *
 * @returns {Array} The array with clauses.
 */
declare function getClausesSplitOnStopWords(sentence: string, options: Object): any[];
