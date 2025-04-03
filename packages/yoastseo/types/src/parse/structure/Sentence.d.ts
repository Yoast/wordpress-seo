export default Sentence;
export type Node = import(".").Node;
export type SourceCodeRange = import("./SourceCodeLocation").SourceCodeRange;
export type Token = import("./Token").default;
/**
 * @typedef {import(".").Node} Node
 * @typedef {import("./SourceCodeLocation").SourceCodeRange} SourceCodeRange
 * @typedef {import("./Token").default} Token
 */
/**
 * A sentence within a text.
 */
declare class Sentence {
    /**
     * Creates a sentence.
     *
     * @param {string} text The sentence's text.
     */
    constructor(text: string);
    /**
     * The text in this sentence.
     * @type {string}
     */
    text: string;
    /**
     * The tokens in this sentence.
     * @type {Token[]}
     */
    tokens: Token[];
    /**
     * The start and end positions of the sentence in the source code.
     * @type {SourceCodeRange}
     */
    sourceCodeRange: SourceCodeRange;
    /**
     * Retrieves the first non-space token in the sentence.
     * @returns {Token|undefined} The first non-space token in the sentence.
     */
    getFirstToken(): Token | undefined;
    /**
     * Retrieves the last non-space token in the sentence.
     * @returns {Token|undefined} The last non-space token in the sentence.
     */
    getLastToken(): Token | undefined;
    /**
     * Sets the parent attributes for this sentence.
     * @param {Node} parentNode The parent node.
     * @param {Node} tree The full tree.
     */
    setParentAttributes(parentNode: Node, tree: Node): void;
    /**
     * The start offset of the parent node.
     * The parent node's start offset is the start offset of the parent node if it doesn't have a `startTag` property.
     * @type {number}
     */
    parentStartOffset: number | undefined;
    /**
     * The block client ID of the parent node.
     * @type {string}
     */
    parentClientId: string | undefined;
    /**
     * The attribute ID of the parent node, if available, otherwise an empty string.
     * Only used for position-based highlighting in sub-blocks of Yoast blocks.
     * @type {string}
     */
    parentAttributeId: string | undefined;
    /**
     * Whether the parent node is the first section of Yoast sub-blocks.
     * Only used for position-based highlighting.
     * @type {boolean}
     */
    isParentFirstSectionOfBlock: boolean | undefined;
}
