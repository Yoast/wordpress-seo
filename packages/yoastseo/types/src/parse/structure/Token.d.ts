export default Token;
export type SourceCodeRange = import("./SourceCodeLocation").SourceCodeRange;
/**
 * @typedef {import("./SourceCodeLocation").SourceCodeRange} SourceCodeRange
 */
/**
 * A token representing a word, whitespace or punctuation in the sentence.
 */
declare class Token {
    /**
     * Creates a new token.
     *
     * @param {string} text The token's text.
     * @param {SourceCodeRange} sourceCodeRange The start and end positions of the token in the source code.
     */
    constructor(text: string, sourceCodeRange?: SourceCodeRange);
    text: string;
    /**
     * The start and end positions of the token in the source code.
     * @type {SourceCodeRange}
     */
    sourceCodeRange: SourceCodeRange;
}
