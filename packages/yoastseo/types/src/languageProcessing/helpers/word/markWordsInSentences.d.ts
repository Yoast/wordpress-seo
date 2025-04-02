/**
 * Adds marks to a sentence.
 *
 * @param {string}      sentence                The sentence in which we want to apply highlighting.
 * @param {Array}       wordsFoundInSentence    The words to highlight in a sentence.
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 * @returns {Mark[]}  The array of Mark objects of each sentence.
 */
export function markWordsInASentence(sentence: string, wordsFoundInSentence: any[], matchWordCustomHelper: Function): Mark[];
/**
 * Adds marks to an array of sentences.
 *
 * @param {[string]}    wordsToMark The words to mark.
 * @param {[string]}    sentences   The sentences in which to mark these words.
 * @param {string}      locale      The locale.
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 *
 * @returns {[string]} The sentences with marks.
 */
export function markWordsInSentences(wordsToMark: [string], sentences: [string], locale: string, matchWordCustomHelper: Function): [string];
export function deConstructAnchor(anchor: string): object;
export function reConstructAnchor(openTag: string, content: string): string;
export function collectMarkingsInSentence(sentence: string, wordsFoundInSentence: [string], matchWordCustomHelper: Function): string;
import Mark from "../../../values/Mark";
