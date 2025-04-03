/**
 * Calculates a recommended keyphrase count for a paper's text. The formula to calculate this number is based on the
 * keyphrase density formula.
 *
 * @param {Paper}	paper						The paper to analyze.
 * @param {number}	keyphraseLength				The length of the focus keyphrase in words.
 * @param {number}	recommendedKeyphraseDensity	The recommended keyphrase density (either maximum or minimum).
 * @param {string}	maxOrMin					Whether it's a maximum or minimum recommended keyphrase density.
 * @param {function} customGetWords				A helper to get words from the text for languages that don't use the default approach.
 *
 * @returns {number} The recommended keyphrase count.
 */
export default function _default(paper: Paper, keyphraseLength: number, recommendedKeyphraseDensity: number, maxOrMin: string, customGetWords: Function): number;
