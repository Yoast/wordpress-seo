export default Mark;
/**
 * Represents a place where highlighting should be applied.
 */
declare class Mark {
    /**
     * Parses the object to a Mark.
     *
     * @param {Object} serialized The serialized object.
     *
     * @returns {Mark} The parsed Mark.
     */
    static parse(serialized: Object): Mark;
    /**
     * Represents a place where highlighting should be applied.
     * We allow both replacement-based highlighting (through providing `original`, `marked`, and potentially `fieldsToMark`) and
     * position-based highlighting (through providing a `position`).
     *
     * @param {Object}   [properties]                  The properties of this Mark.
     *
     * @param {string}  [properties.original]         The original text that should be marked.
     * @param {string}  [properties.marked]           The new text including marks.
     * @param {array}   [properties.fieldsToMark]     The array that specifies which text section(s) to mark, e.g. "heading".
     *
     * @param {SourceCodeRange} [properties.position] The position object: a range in the source code.
     */
    constructor(properties?: {
        original?: string | undefined;
        marked?: string | undefined;
        fieldsToMark?: any;
        position?: any;
    } | undefined);
    _properties: {
        original?: string | undefined;
        marked?: string | undefined;
        fieldsToMark?: any;
        position?: any;
    };
    /**
     * Returns the original text.
     *
     * @returns {string} The original text.
     */
    getOriginal(): string;
    /**
     * Returns the marked text.
     *
     * @returns {string} The replaced text.
     */
    getMarked(): string;
    /**
     * Returns the fields to mark.
     *
     * @returns {array} The fields to mark.
     */
    getFieldsToMark(): array;
    /**
     * Returns the position information.
     *
     * @returns {Object} The position information.
     */
    getPosition(): Object;
    /**
     * Returns the start position.
     *
     * @returns {number} The start position.
     */
    getPositionStart(): number;
    /**
     * Returns the end position.
     *
     * @returns {number} The end position.
     */
    getPositionEnd(): number;
    /**
     * Sets the start position.
     *
     * @param {number} positionStart The new start position.
     *
     * @returns {void}
     */
    setPositionStart(positionStart: number): void;
    /**
     * Sets the end position.
     *
     * @param {number} positionEnd The new end position.
     *
     * @returns {void}
     */
    setPositionEnd(positionEnd: number): void;
    /**
     * Returns the start position of a block.
     *
     * @param {number} startOffsetBlock The block start offset.
     *
     * @returns {number} The start position of a block.
     */
    setBlockPositionStart(startOffsetBlock: number): number;
    /**
     * Returns the end position of a block.
     *
     * @param {number} endOffsetBlock The block end offset.
     *
     * @returns {number} The end position of a block.
     */
    setBlockPositionEnd(endOffsetBlock: number): number;
    /**
     * Gets the block client id.
     *
     * @returns {string} The block client id.
     */
    getBlockClientId(): string;
    /**
     * Gets the block attribute id.
     *
     * @returns {string} The block attribute id.
     */
    getBlockAttributeId(): string;
    /**
     * Checks if the mark object is intended for the first section of a Yoast sub-block.
     * This method will be used only for Yoast blocks where each block consists of sub-blocks
     * with two sections.
     *
     * @returns {boolean} Whether the mark object is intended for the first section of a Yoast sub-block.
     */
    isMarkForFirstBlockSection(): boolean;
    /**
     * Returns the start position inside block.
     *
     * @returns {number} The start position inside the block if the mark has position information, undefined otherwise.
     */
    getBlockPositionStart(): number;
    /**
     * Returns the end position inside block if the mark has position information, undefined otherwise.
     *
     * @returns {number} The end position inside block.
     */
    getBlockPositionEnd(): number;
    /**
     * Applies this mark to the given text with replacement-based highlighting.
     *
     * @param {string} text The original text without the mark applied.
     * @returns {string} A new text with the mark applied to it.
     */
    applyWithReplace(text: string): string;
    /**
     * Applies this mark to the given text with position-based highlighting.
     *
     * @param {string} text The original text without the mark applied.
     * @returns {string} A new text with the mark applied to it.
     */
    applyWithPosition(text: string): string;
    /**
     * Serializes the Mark instance to an object.
     *
     * @returns {Object} The serialized Mark.
     */
    serialize(): Object;
    /**
     * Checks if the mark object is valid for position-based highlighting.
     * @returns {void}
     */
    isValid(): void;
    /**
     * Checks if a mark has position information available.
     * @returns {boolean} Returns true if the Mark object has position information, false otherwise.
     */
    hasPosition(): boolean;
    /**
     * Checks if a mark has block position information available.
     * A block has position information if the block start offset is available.
     *
     * @returns {boolean} Returns true if the Mark object has block position information, false otherwise.
     */
    hasBlockPosition(): boolean;
}
