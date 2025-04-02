export default Heading;
export type Text = import(".").Text;
/**
 * @typedef {import(".").Text} Text
 */
/**
 * A heading in the tree.
 */
declare class Heading extends Node {
    /**
     * Creates a new heading.
     *
     * @param {1|2|3|4|5|6} level The heading level (e.g. `1` for `h1` up to `6` for `h6`).
     * @param {Object} attributes This heading's attributes.
     * @param {(Node|Text)[]} childNodes This heading's child nodes.
     * @param {Object} sourceCodeLocationInfo This heading's location in the source code, from parse5.
     */
    constructor(level: 1 | 2 | 3 | 4 | 5 | 6, attributes?: Object, childNodes?: (Node | Text)[], sourceCodeLocationInfo?: Object);
    /**
     * This heading's level (e.g. `1` for `h1`, `2` for `h2` etc.).
     *
     * @type {1|2|3|4|5|6}
     */
    level: 1 | 2 | 3 | 4 | 5 | 6;
}
import Node from "./Node";
