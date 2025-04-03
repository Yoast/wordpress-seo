/**
 * Class for tokenizing a (html) text into sentences.
 */
export default class GermanSentenceTokenizer extends SentenceTokenizer {
    /**
     * Checks whether a fullstop is an ordinal dot instead of a sentence splitter.
     * See: https://en.wikipedia.org/wiki/Ordinal_indicator#Ordinal_dot
     *
     * @param {string} currentSentence A string ending with a full stop.
     * @returns {boolean} Returns true if the full stop is an ordinal dot, false otherwise.
     */
    endsWithOrdinalDot(currentSentence: string): boolean;
}
import SentenceTokenizer from "../../../../helpers/sentence/SentenceTokenizer";
