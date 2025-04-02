export default Paragraph;
export type Text = import(".").Text;
/**
 * @typedef {import(".").Text} Text
 */
/**
 * A paragraph in the tree.
 *
 * @see https://html.spec.whatwg.org/dev/dom.html#paragraphs
 */
declare class Paragraph extends Node {
    /**
     * Creates and returns a new implicit paragraph.
     *
     * @param {Object} attributes The paragraph's attributes.
     * @param {(Node|Text)[]} childNodes This paragraph's child nodes.
     * @param {Object} sourceCodeLocationInfo This paragraph's location in the source code, from parse5.
     *
     * @returns {Paragraph} A new implicit paragraph.
     */
    static createImplicit(attributes?: Object, childNodes?: (Node | Text)[], sourceCodeLocationInfo?: Object): Paragraph;
    /**
     * Creates a new paragraph.
     *
     * @param {Object} attributes The paragraph's attributes.
     * @param {(Node|Text)[]} childNodes This paragraph's child nodes.
     * @param {Object} sourceCodeLocationInfo This paragraph's location in the source code, from parse5.
     * @param {boolean} isImplicit Whether this paragraph is an implicit paragraph, or an explicit paragraph.
     * @param {boolean} isOverarching Whether this paragraph is overarching text that is separated by double line breaks.
     */
    constructor(attributes?: Object, childNodes?: (Node | Text)[], sourceCodeLocationInfo?: Object, isImplicit?: boolean, isOverarching?: boolean);
    /**
     * Whether this paragraph is explicit (defined by an explicit `<p>` tag within the markup),
     * or implicit (defined by a run of phrasing content).
     *
     * @see https://html.spec.whatwg.org/dev/dom.html#paragraphs
     *
     * @type {boolean}
     */
    isImplicit: boolean;
}
import Node from "./Node";
