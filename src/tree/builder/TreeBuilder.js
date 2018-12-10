
/**
 * Class used to build a Structured Tree, to be used in further analysis.
 *
 * Implements the `TreeAdapter` of the `parse5` library.
 * @see https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/tree-adapter/interface.md
 */
class TreeBuilder {
	/**
	 * Makes a new TreeBuilder.
	 */
	constructor() {
		this.currentParent = null;
	}

	/**
	 * Creates a new Node in the tree.
	 *
	 * @param {string} tagName			The tag name of the parsed element.
	 * @param {string} nameSpaceURI		The name space URI of this element.
	 * @param {Object[]} attrs 		The attributes of this element.
	 *
	 * @returns {Node} The created Node.
	 */
	createElement( tagName, nameSpaceURI, attrs ) {
		let node;
		switch ( tagName ) {
			default:
				// StructuredNode
				node = {
					type: tagName,
					nameSpaceURI: nameSpaceURI,
					attributes: attrs,
					parent: this.currentParent,
					children: [],
				};
		}
		this.currentParent = node;
		return node;
	}

	/**
	 * Returns the tag name (type) of the given node.
	 *
	 * @param {Node} node	The node of which to get the type.
	 * @returns {string} The type of the given node.
	 */
	getTagName( node ) {
		return node.type;
	}

	/**
	 * Returns the name space URI of the given node.
	 *
	 * @param {Node} node	The node of which to get the name space URI.
	 * @returns {string} The name space URI of the given node.
	 */
	getNamespaceURI( node ) {
		return node.nameSpaceURI;
	}

	/**
	 * Returns the parent node of the given node.
	 *
	 * @param {Node} node	The node of which to get the parent node.
	 * @returns {Node} The parent node of the given node.
	 */
	getParentNode( node ) {
		return node.parent;
	}

	/**
	 * Appends a child node to a parent node.
	 *
	 * @param {Node} parent	The node to which to add the child.
	 * @param {Node} child		The node that needs to be added to the parent.
	 *
	 * @returns {void}
	 */
	appendChild( parent, child ) {
		parent.children.push( child );
	}

	/**
	 * Appends a TextContainer to a parent node.
	 *
	 * @param {Node} parent	The node to which to append the text.
	 * @param {string} text	The text to parse to a TextContainer and add to the parent.
	 *
	 * @returns {void}
	 */
	insertText( parent, text ) {
		// Parse text to TextContainer.

		// Add textContainer to parent.
		parent.text = text;
	}

	/**
	 * Returns the first child of the given Node.
	 *
	 * @param {Node} node	The node from which to get the first child.
	 *
	 * @returns {Node|null} The first child, or `null` if no children have been defined.
	 */
	getFirstChild( node ) {
		return node.children ? node.children[ 0 ] : null;
	}

	/**
	 * Creates a root Node to which to add the html contents as children.
	 *
	 * @returns {Node} The root node.
	 */
	createDocumentFragment() {
		// StructuredNode
		return {
			type: "div",
			children: [],
		};
	}

	/**
	 * Detaches the given Node from its parent.
	 *
	 * @param {Node} node	The node to detach from its parent.
	 *
	 * @returns {void}
	 */
	detachNode( node ) {
		const nodeIndex = node.parent.children.indexOf( node );
		node.parent.children.splice( nodeIndex, 1 );
	}
}
export default TreeBuilder;
