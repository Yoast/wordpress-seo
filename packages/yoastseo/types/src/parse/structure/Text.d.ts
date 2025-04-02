export default Text;
/**
 * A text.
 */
declare class Text {
    /**
     * Creates a new Text object, that consist of some text and a source code range.
     *
     * @param {object} textNode The current #text node in the parse5 tree.
     */
    constructor(textNode: object);
    name: string;
    /**
     * This text's content.
     *
     * @type {string}
     */
    value: string;
    sourceCodeRange: SourceCodeLocation;
}
import SourceCodeLocation from "./SourceCodeLocation";
