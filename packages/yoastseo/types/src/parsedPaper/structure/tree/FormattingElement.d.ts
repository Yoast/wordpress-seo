export default FormattingElement;
/**
 * Represents formatting elements (e.g. link, image, bold text) within a document.
 *
 * @memberOf module:parsedPaper/structure
 */
declare class FormattingElement {
    /**
     * Represents a formatting element (e.g. link, image, bold text) within a document.
     *
     * @param {string} type               The type of this element ("link", "image", "bold", etc.).
     * @param {Object} sourceCodeLocation The parse5 formatted location of the element inside of the source code.
     * @param {Object} [attributes=null]  The attributes (as key-value pairs, e.g. `{ href: '...' }` ).
     */
    constructor(type: string, sourceCodeLocation: Object, attributes?: Object | undefined);
    /**
     * Type of formatting element (e.g. "strong", "a").
     * @type {string}
     */
    type: string;
    /**
     * Attributes of this element (e.g. "href", "id").
     * @type {?Object}
     */
    attributes: Object | null;
    /**
     * Location inside of the source code.
     * @type {SourceCodeLocation}
     */
    sourceCodeLocation: SourceCodeLocation;
    /**
     * Start of this element's content within the parent textContainer's text.
     * @type {?number}
     */
    textStartIndex: number | null;
    /**
     * End of this element's content within the parent textContainer's text.
     * @type {?number}
     */
    textEndIndex: number | null;
    /**
     * This formatting element's parent.
     * @type {LeafNode}
     */
    parent: LeafNode;
    /**
     * Returns the attribute with the given name if it exists.
     *
     * @param {string} name The name of the attribute.
     *
     * @returns {false|*} The attribute or `false` if the attribute does not exist.
     */
    getAttribute(name: string): false | any;
}
import SourceCodeLocation from "./SourceCodeLocation";
