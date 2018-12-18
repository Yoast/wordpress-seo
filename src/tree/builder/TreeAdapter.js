/* Internal dependencies */
import FormattingElement from "../values/FormattingElement";
import Heading from "../values/nodes/Heading";
import List from "../values/nodes/List";
import ListItem from "../values/nodes/ListItem";
import Paragraph from "../values/nodes/Paragraph";
import StructuredIrrelevant from "../values/nodes/StructuredIrrelevant";
import StructuredNode from "../values/nodes/StructuredNode";

const formattingElements = [ "strong", "emph" ];
const irrelevantHtmlElements = [ "script", "style", "pre" ];
const headings = [ "h1", "h2", "h3", "h4", "h5", "h6" ];

/**
 * An adapter to parse the HTML source code to a structured tree representation, to be used in further analysis,
 * in combination with the `parse5` library.
 *
 * Implements the `parse5` library's `TreeAdapter` interface
 * @see https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/tree-adapter/interface.md
 */
class TreeAdapter {
	/* Creation of nodes and other tree elements. */

	/**
	 * Creates a new element to be put in the tree.
	 *
	 * @param {string} tag									The HTML tag.
	 * @param {string} namespace							The XML namespace (e.g. "http://www.w3.org/1999/xhtml" for HTML).
	 * @param {{ name: string, value: string }[]} attributes	The attributes of this element.
	 *
	 * @returns {Node|FormattingElement} The new element.
	 */
	createElement( tag, namespace, attributes ) {
		let node;

		if ( formattingElements.includes( tag ) ) {
			// Formatting element.
			const parsedAttributes = this._parseAttributes( attributes );
			node = new FormattingElement( tag, parsedAttributes );
		} else if ( irrelevantHtmlElements.includes( tag ) ) {
			// Irrelevant for analysis (e.g. `script`, `style`).
			node = new StructuredIrrelevant( tag );
		} else {
			// Paragraphs, Headers, Lists, ListItems and other nodes.
			node = this._parseNode( tag );
		}

		node.tagName = tag;
		node.namespace = namespace;
		node.parent = null;

		return node;
	}

	/**
	 * Makes a new node to add to the tree, based on the given HTML-tag.
	 *
	 * @param {string} tag		The HTML-tag of the element to add.
	 *
	 * @returns {Node} The node to add to the tree.
	 *
	 * @private
	 */
	_parseNode( tag ) {
		if ( headings.includes( tag ) ) {
			// Heading.
			return new Heading( parseInt( tag[ 1 ], 10 ) );
		} else if ( tag === "p" ) {
			// Paragraph.
			return new Paragraph( tag );
		} else if ( tag === "ol" || tag === "ul" ) {
			// List.
			return new List( tag === "ol" );
		} else if ( tag === "li" ) {
			// List item.
			return new ListItem();
		}
		// All other elements (`div`, `section`).
		return new StructuredNode( tag );
	}

	/**
	 * Parses the HTML element attributes from parse5's format to a plain JS object.
	 * E.g. `{ name: "id", value: "an-id" }` becomes ` { id: "an-id" }`.
	 *
	 * @param {{ name: string, value: string }[]} parse5attributes		The attributes as parsed by parse5.
	 *
	 * @returns {Object} The parsed attributes.
	 *
	 * @private
	 */
	_parseAttributes( parse5attributes ) {
		return parse5attributes.reduce( ( attributes, attribute ) => {
			attributes[ attribute.name ] = attribute.value;
			return attributes;
		}, {} );
	}

	/**
	 * Creates a new empty document fragment (e.g. a part of an HTML document).
	 *
	 * @returns {StructuredNode} A new empty document fragment.
	 */
	createDocumentFragment() {
		return new StructuredNode( "root" );
	}

	/**
	 * Creates a new node representing an HTML-comment.
	 *
	 * @param {string} text	The comment text.
	 *
	 * @returns {StructuredIrrelevant} The node representing the comment.
	 */
	createCommentNode( text ) {
		const node = new StructuredIrrelevant( "comment" );
		node.parent = null;
		node.content = text;
		return node;
	}

	// Tree manipulation.

	/**
	 * Appends a child node to a parent node.
	 *
	 * @param {Node} parent	The parent node.
	 * @param {Node} child		The child to add to the parent node.
	 *
	 * @returns {void}
	 */
	appendChild( parent, child ) {
		child.parent = parent;
		if ( child instanceof FormattingElement ) {
			// Formatting element.
			if ( parent instanceof StructuredNode ) {
				// Wrap it in a paragraph, add it as formatting.
				const paragraph = new Paragraph();
				paragraph.textContainer.formatting.push( child );
				parent.children.push( child );
			} else {
				// Hoist formatting element up the tree until it encounters a Heading or Paragraph.
				while ( ! ( parent instanceof Paragraph || parent instanceof Heading ) ) {
					parent = parent.parent;
				}
				// Add it as formatting to the parent.
				parent.textContainer.formatting.push( child );
			}
			return;
		}
		// Just add nodes to parent's children if not formatting.
		parent.children.push( child );
	}

	/**
	 * Detaches a node from its parent.
	 *
	 * @param {Node} node	The node to detach from its parent.
	 *
	 * @returns {void}
	 */
	detachNode( node ) {
		if ( node.parent ) {
			const index = node.parent.children.indexOf( node );
			node.parent.children.splice( index, 1 );
			node.parent = null;
		}
	}

	/**
	 * Appends text to a node in the tree.
	 *
	 * To which node it is appended depends on a few factors:
	 *  1. If its parent is a paragraph or header: append the text to its text container.
	 *  2. If its parent is a structured node: wrap text in a paragraph, add paragraph to parent.
	 *  3. If its parent is a formatting element: append text to the most recent ancestor who is a paragraph or heading.
	 *
	 * @param {Node} node		The node to (try to) append the text to.
	 * @param {string} text	The text to append to the node.
	 *
	 * @returns {void}
	 */
	insertText( node, text ) {
		if ( node instanceof Heading || node instanceof Paragraph ) {
			node.textContainer.appendText( text );
		} else if ( node instanceof FormattingElement ) {
			this._addFormattingElementText( node, text );
		} else {
			this._addStructuredNodeText( node, text );
		}
	}

	/**
	 * Appends the given text to the formatting element's most recent ancestor
	 * who is either a paragraph or a heading.
	 *
	 * @param {FormattingElement} formattingElement	The formatting element.
	 * @param {string} text 						The text to add.
	 *
	 * @returns {void}
	 *
	 * @private
	 */
	_addFormattingElementText( formattingElement, text ) {
		// Hoist element up the tree until it encounters a paragraph or heading.
		let parent = formattingElement.parent;
		while ( ! ( parent instanceof Paragraph || parent instanceof Heading ) ) {
			parent = parent.parent;
		}
		// Append text to parent's text container.
		parent.textContainer.appendText( text );
	}

	/**
	 * Appends the given text to either:
	 *  1. The node's most recent child, if it is a paragraph or a heading.
	 *  2. A new paragraph, if not.
	 *
	 * @param {StructuredNode} node		The node.
	 * @param {string} text			The text to append.
	 *
	 * @returns {void}
	 *
	 * @private
	 */
	_addStructuredNodeText( node, text ) {
		// Get the previous sibling of this node.
		const prevChild = node.children[ node.children.length - 1 ];
		// If the previous child is a paragraph...
		if ( prevChild && prevChild instanceof Paragraph ) {
			// Append text to the paragraph.
			prevChild.textContainer.appendText( text );
		} else {
			// Else: wrap the text in an implicit paragraph and add it as a new child.
			const paragraph = new Paragraph();
			paragraph.textContainer.appendText( text );
			node.children.push( paragraph );
		}
	}

	// Node getters and setters.

	/**
	 * Returns this node's tag name.
	 * (e.g. "h1", "p", "comment", "h3", "div")
	 *
	 * This is used by `parse5` to be able to differentiate between different
	 * behavior of HTML elements.
	 *
	 * @param {Node} node The node to get the tag name from.
	 *
	 * @returns {string} The node's tag name.
	 */
	getTagName( node ) {
		return node.tagName;
	}

	/**
	 * Returns this node's namespace URI.
	 * (e.g. "http://www.w3.org/1999/xhtml" for HTML)
	 *
	 * This is used by `parse5` to differentiate between parsing
	 * HTML, SVG and other XML schema types.
	 *
	 * @param {Node} node The node to get the namespace URI from.
	 *
	 * @returns {string} The namespace URI of this node.
	 */
	getNamespaceURI( node ) {
		return node.namespace;
	}

	/**
	 * Returns this node's parent node.
	 *
	 * @param {Node} node	The node from which to retrieve the parent.
	 *
	 * @returns {Node} The parent of this node.
	 */
	getParentNode( node ) {
		return node.parent;
	}

	/**
	 * Returns the children of the given node.
	 *
	 * If the node does not have any children and cannot get any (e.g. Heading, FormattingElement)
	 * this function returns an empty list.
	 *
	 * @param {Node} node	The node to get the children from.
	 *
	 * @returns {Node[]} The children of the given node.
	 */
	getChildNodes( node ) {
		/*
		  Some node types do not have children (like Paragraph and Heading),
		  but parse5 always expects a node to have children.
		 */
		return node.children || [];
	}

	/**
	 * Gets a parent's first child.
	 *
	 * @see https://en.wikipedia.org/wiki/Rumpelstiltskin
	 *
	 * @param {Node} node	The node to get its first child from.
	 *
	 * @returns {Node[]|null} The node's first child or null, if this node cannot get any children.
	 */
	getFirstChild( node ) {
		return node.children[ 0 ] || null;
	}

	// Node source location.

	/**
	 * Sets the node's location as found in the source code.
	 *
	 * More often than not this is not the entire info
	 * and misses the location of the end tag...
	 *
	 * We still need to add it, since `parse5` appends the end tag position
	 * to this object somewhere during parsing.
	 *
	 * @param {Node} node	The node to set its location.
	 * @param {Location} location the node's location in the source code.
	 *
	 * @returns {void}
	 */
	setNodeSourceCodeLocation( node, location ) {
		if ( ! node ) {
			return;
		}
		node.location = location;
	}

	/**
	 * Gets the node's source code location.
	 *
	 * @param {Node} node	The node to get its source code location from.
	 * @returns {Location|void} The node's source code location.
	 */
	getNodeSourceCodeLocation( node ) {
		if ( ! node ) {
			return;
		}
		return node.location;
	}
}

export default TreeAdapter;
