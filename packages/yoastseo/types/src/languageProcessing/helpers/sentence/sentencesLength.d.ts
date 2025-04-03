/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default} Researcher
 * @typedef {import("../../../parse/structure/Sentence").default} Sentence
 * @typedef {import("../../../parse/structure/Token").default} Token
 */
/**
 * @typedef {Object} SentenceLength
 * @property {Sentence} sentence The sentence.
 * @property {number} sentenceLength The length of the sentence.
 * @property {Token} firstToken The first token of the sentence.
 * @property {Token} lastToken The last token of the sentence.
 */
/**
 * Returns an array with the length of each sentence.
 *
 * @param {Sentence[]} sentences Array with sentences from text.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {SentenceLength[]} Array with the length of each sentence.
 */
export default function _default(sentences: Sentence[], researcher: Researcher): SentenceLength[];
export type Researcher = import("../../../languageProcessing/AbstractResearcher").default;
export type Sentence = import("../../../parse/structure/Sentence").default;
export type Token = import("../../../parse/structure/Token").default;
export type SentenceLength = {
    /**
     * The sentence.
     */
    sentence: Sentence;
    /**
     * The length of the sentence.
     */
    sentenceLength: number;
    /**
     * The first token of the sentence.
     */
    firstToken: Token;
    /**
     * The last token of the sentence.
     */
    lastToken: Token;
};
