export default LeafNode;
/**
 * A node at the end of the tree that may only contain formatting elements,
 * these include headings and paragraphs.
 *
 * @extends module:parsedPaper/structure.Node
 *
 * @memberOf module:parsedPaper/structure
 *
 * @abstract
 */
declare class LeafNode {
    /**
     * Creates a new leaf node.
     *
     * @param {string} type               The type of Node (should be unique for each child class of Node).
     * @param {Object} sourceCodeLocation The parse5 formatted location of the element inside of the source code.
     *
     * @returns {void}
     */
    constructor(type: string, sourceCodeLocation: Object);
    /**
     * A container for keeping this leaf node's text.
     * @type {module:parsedPaper/structure.TextContainer}
     */
    textContainer: any;
    /**
     * Sets the heading text (via the TextContainer).
     *
     * @param {string} text The text to assign as the heading text.
     *
     * @returns {void}
     */
    set text(text: string);
    /**
     * Retrieves the heading text (from the TextContainer).
     *
     * @returns {string} The text of the heading.
     */
    get text(): string;
    /**
     * Appends text to this leaf node.
     *
     * @param {string} text The text to append.
     *
     * @returns {void}
     */
    appendText(text: string): void;
    /**
     * Adds formatting and sets the formatting's parent to this leaf node.
     *
     * @param {FormattingElement} formatting The formatting to add.
     *
     * @returns {void}
     */
    addFormatting(formatting: FormattingElement): void;
}
