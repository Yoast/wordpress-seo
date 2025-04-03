/**
 * Contains language-specific logic for splitting a text into sentences and tokens.
 */
export default class LanguageProcessor {
    /**
     * Creates a new language processor.
     *
     * @param {Researcher} researcher The researcher to use.
     */
    constructor(researcher: Researcher);
    researcher: Researcher;
    /**
     * Split text into sentences.
     *
     * @param {string} text The text to split into sentences.
     *
     * @returns {Sentence[]} The sentences.
     */
    splitIntoSentences(text: string): Sentence[];
    /**
     * Split sentence into tokens.
     *
     * @param {Sentence} sentence The sentence to split.
     *
     * @returns {Token[]} The tokens.
     */
    splitIntoTokens(sentence: Sentence): Token[];
}
import Sentence from "../structure/Sentence";
import Token from "../structure/Token";
