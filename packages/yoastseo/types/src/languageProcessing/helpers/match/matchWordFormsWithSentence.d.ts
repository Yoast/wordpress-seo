export function tokenizeKeyphraseFormsForExactMatching(wordForms: (string[]), customSplitIntoTokensHelper: Function): string[];
export default matchWordFormsWithSentence;
/**
 * Matches the word forms of a keyphrase with a sentence object from the html parser.
 *
 * @param {Sentence|string}	sentence					The sentence to match against the word forms of a keyphrase.
 * @param {string[]}		wordForms					The array of word forms of the keyphrase.
 * E.g. If the keyphrase is "key word", then (if Premium is activated) this will be [ "key", "keys" ] OR [ "word", "words" ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {string}			locale						The locale used for transliteration.
 * @param {function}		matchWordCustomHelper		Custom function to match a word form with sentence.
 * @param {boolean}			useExactMatching			Whether to match the keyphrase forms exactly or not.
 * 														Exact match is used when the keyphrase is enclosed in double quotes.
 * @param {function}		customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {{count: number, matches: (Token|string)[]}} Object containing the number of the matches and the matched tokens.
 */
declare function matchWordFormsWithSentence(sentence: Sentence | string, wordForms: string[], locale: string, matchWordCustomHelper: Function, useExactMatching: boolean | undefined, customSplitIntoTokensHelper: Function): {
    count: number;
    matches: (Token | string)[];
};
