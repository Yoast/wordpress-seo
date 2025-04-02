/**
 * Counts the occurrences of the keyphrase in the text and creates the Mark objects for the matches.
 *
 * @param {(Sentence|string)[]}	sentences			The sentences to check.
 * @param {Array}		keyphraseForms				The keyphrase forms.
 * @param {string}		locale						The locale used in the analysis.
 * @param {function}	matchWordCustomHelper		A custom helper to match words with a text.
 * @param {boolean}		isExactMatchRequested		Whether the exact matching is requested.
 * @param {function}	customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {{markings: Mark[], count: number}} The number of keyphrase occurrences in the text and the Mark objects of the matches.
 */
export function countKeyphraseInText(sentences: (Sentence | string)[], keyphraseForms: any[], locale: string, matchWordCustomHelper: Function, isExactMatchRequested: boolean, customSplitIntoTokensHelper: Function): {
    markings: Mark[];
    count: number;
};
/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {{count: number, markings: Mark[], keyphraseLength: number}} An object containing the keyphrase count, markings and the kephrase length.
 */
export default function getKeyphraseCount(paper: Paper, researcher: Researcher): {
    count: number;
    markings: Mark[];
    keyphraseLength: number;
};
/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @deprecated Use getKeyphraseCount instead.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An array of all the matches, markings and the keyphrase count.
 */
export function keywordCount(paper: Paper, researcher: Researcher): Object;
