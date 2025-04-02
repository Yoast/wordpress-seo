/**
 * Class for tokenizing a (html) text into sentences.
 */
export default class JapaneseSentenceTokenizer extends SentenceTokenizer {
    /**
     * Always returns true as Japanese sentence beginning doesn't need to be preceded by a whitespace to be a valid one.
     *
     * @returns {true}  Always true.
     */
    isCharacterASpace(): true;
}
import SentenceTokenizer from "../../../../helpers/sentence/SentenceTokenizer";
