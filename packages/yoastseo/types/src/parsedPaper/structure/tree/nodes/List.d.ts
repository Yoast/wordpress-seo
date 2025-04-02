export default List;
/**
 * Represents a list of items.
 *
 * @extends module:parsedPaper/structure.Node
 *
 * @memberOf module:parsedPaper/structure
 */
declare class List {
    /**
     * Represents a list of items.
     *
     * @param {boolean} ordered            Whether the list is ordered or not.
     * @param {Object}  sourceCodeLocation The parse5 formatted location of the element inside of the source code.
     *
     * @returns {void}
     */
    constructor(ordered: boolean, sourceCodeLocation: Object);
    /**
     * If this list is ordered.
     * @type {boolean}
     */
    ordered: boolean;
    /**
     * This node's children (should only be list items).
     * @type {ListItem[]}
     */
    children: ListItem[];
    /**
     * Appends the child to this List's children.
     *
     * @param {ListItem} child The child to add.
     * @returns {void}
     */
    addChild(child: ListItem): void;
}
import ListItem from "./ListItem";
