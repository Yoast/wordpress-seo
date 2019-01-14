// Tree elements.
import FormattingElement from "../structure/FormattingElement";
import Heading from "../structure/nodes/Heading";
import LeafNode from "../structure/nodes/LeafNode";
import List from "../structure/nodes/List";
import ListItem from "../structure/nodes/ListItem";
import Paragraph from "../structure/nodes/Paragraph";
import StructuredIrrelevant from "../structure/nodes/StructuredIrrelevant";
import StructuredNode from "../structure/nodes/StructuredNode";
// HTML classes.
import { formattingElements, headings, irrelevantHtmlElements } from "./htmlClasses";

/**
 * An adapter to parse the HTML source code to a structured tree representation, to be used in further analysis,
 * in combination with the `parse5` library.
 *
 * Implements the `parse5` library's `TreeAdapter` interface.
 * @see https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/tree-adapter/interface.md
 *
 * @memberOf module:tree/builder
 *
 * @private
 */
class TreeAdapter {
	// Creation of nodes and other tree elements.

	/**
	 * Creates a new element to be put in the tree.
	 *
	 * @param {string} tag                                        The HTML tag.
	 * @param {string} namespace                                  The XML namespace (e.g. "http://www.w3.org/1999/xhtml" for HTML).
	 * @param {Array<{ name: string, value: string }>} attributes The attributes of this element.
	 *
	 * @returns {module:tree/structure.Node|module:tree/structure.FormattingElement} The new element.
	 */
	createElement( tag, namespace, attributes ) {
		let node;

		if ( irrelevantHtmlElements.includes( tag ) ) {
			// Irrelevant for analysis (e.g. `script`, `style`).
			node = new StructuredIrrelevant( tag );
		} else if ( formattingElements.includes( tag ) ) {
			// Formatting element.
			const parsedAttributes = TreeAdapter._parseAttributes( attributes );
			node = new FormattingElement( tag, parsedAttributes );
		} else {
			// Paragraphs, Headers, Lists, ListItems and other nodes.
			node = TreeAdapter._parseNode( tag );
		}

		/*
		  We need to add the tag name for `parse5`
		  to track the still open HTML elements correctly.
		  (E.g. when it encounters a closing tag, it know which element needs to be closed).
		 */
		node.tagName = tag;
		node.namespace = namespace;
		node.parent = null;

		return node;
	}

	/**
	 * Makes a new node to add to the tree, based on the given HTML-tag.
	 *
	 * @param {string} tag The HTML-tag of the element to add.
	 *
	 * @returns {module:tree/structure.Node} The node to add to the tree.
	 *
	 * @private
	 */
	static _parseNode( tag ) {
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
	 * @param {Array<{ name: string, value: string }>} parse5attributes The attributes as parsed by parse5.
	 *
	 * @returns {Object} The parsed attributes.
	 *
	 * @private
	 */
	static _parseAttributes( parse5attributes ) {
		if ( parse5attributes && parse5attributes.length > 0 ) {
			return parse5attributes.reduce( ( attributes, attribute ) => {
				attributes[ attribute.name ] = attribute.value;
				return attributes;
			}, {} );
		}
		return null;
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
	 * @param {string} text The comment text.
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
	 * @param {Node} parent The parent node.
	 * @param {Node} child  The child to add to the parent node.
	 *
	 * @returns {void}
	 */
	appendChild( parent, child ) {
		/*
		  Do not do anything with irrelevant content.
		  (We get the raw string contents later on from the source code).
		 */
		if ( parent instanceof StructuredIrrelevant ) {
			return;
		}

		/*
		  Structured (irrelevant) nodes can also be contained within headings, paragraphs
		  and formatting elements, even though it is not entirely valid HTML,
		  so we need to transform the structured node
		  to a FormattingElement and add it to the respective heading or paragraph.
		 */
		if ( ( child instanceof StructuredIrrelevant || child instanceof StructuredNode ) &&
			( child instanceof LeafNode || parent instanceof FormattingElement ) ) {
			// Add structured (irrelevant) node as formatting to the first header or paragraph ancestor.
			const element = new FormattingElement( child.tagName );
			element.location = child.location;
			TreeAdapter._appendFormattingElement( parent, element );
			return;
		}

		// Add formatting element to its first ancestor that is either a heading or paragraph.
		if ( child instanceof FormattingElement ) {
			TreeAdapter._appendFormattingElement( parent, child );
			return;
		}

		// Just add nodes to parent's children in any other case.
		child.parent = parent;
		parent.children.push( child );
	}

	/**
	 * Appends the formatting element to the tree.
	 *
	 * @param {Node} parent                          The (current) parent of the formatting element.
	 * @param {FormattingElement} formattingElement  The formatting element to add to the tree.
	 *
	 * @returns {void}
	 *
	 * @private
	 */
	static _appendFormattingElement( parent, formattingElement ) {
		formattingElement.parent = parent;
		if ( parent instanceof StructuredNode ) {
			// Wrap it in a paragraph, add it as formatting.
			TreeAdapter._addOrphanedFormattingElement( parent, formattingElement );
		} else {
			/*
			 Formatting elements can be nested, we want to add it to
			 the most recent ancestor which is either a heading or paragraph.
			 */
			const ancestor = TreeAdapter._findAncestorLeafNode( formattingElement );
			if ( ancestor ) {
				// Add formatting element as formatting to the found paragraph or heading ancestor.
				formattingElement.parent = parent;
				ancestor.textContainer.formatting.push( formattingElement );
			} else {
				// Wrap formatting element in paragraph, add it to the tree.
				TreeAdapter._addOrphanedFormattingElement( parent, formattingElement );
			}
		}
	}

	/**
	 * Wraps a formatting element in a paragraph and adds the resulting paragraph to the given parent.
	 *
	 * @param {Node} parent                          The parent element to add the new paragraph to.
	 * @param {FormattingElement} formattingElement  The formatting element to wrap in a paragraph and add to the tree.
	 *
	 * @returns {void}
	 *
	 * @private
	 */
	static _addOrphanedFormattingElement( parent, formattingElement ) {
		const paragraph = new Paragraph();
		paragraph.location = formattingElement.location;

		paragraph.textContainer.formatting.push( formattingElement );

		paragraph.parent = parent;
		formattingElement.parent = paragraph;
		parent.children.push( paragraph );
	}

	/**
	 * Detaches a node from its parent.
	 *
	 * @param {Node} node The node to detach from its parent.
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
	 * @param {Node} node   The node to (try to) append the text to.
	 * @param {string} text The text to append to the node.
	 *
	 * @returns {void}
	 */
	insertText( node, text ) {
		// Do not add text to irrelevant nodes. We are going to add it later from the source text.
		if ( node instanceof StructuredIrrelevant ) {
			return;
		}

		if ( node instanceof LeafNode ) {
			// Node may only contain formatting elements.
			node.textContainer.appendText( text );
		} else if ( node instanceof FormattingElement ) {
			TreeAdapter._addFormattingElementText( node, text );
		} else {
			TreeAdapter._addStructuredNodeText( node, text );
		}
	}

	/**
	 * Appends the given text to the formatting element's most recent ancestor
	 * who is either a paragraph or a heading.
	 *
	 * @param {FormattingElement} formattingElement The formatting element.
	 * @param {string} text                         The text to add.
	 *
	 * @returns {void}
	 *
	 * @private
	 */
	static _addFormattingElementText( formattingElement, text ) {
		// Find a paragraph or header ancestor.
		const ancestor = TreeAdapter._findAncestorLeafNode( formattingElement );
		// Append text to ancestor's text container.
		if ( ancestor ) {
			ancestor.textContainer.appendText( text );
		}
	}

	/**
	 * Appends the given text to either:
	 *  1. The node's most recent child, if it is a paragraph or a heading.
	 *  2. A new paragraph, if not.
	 *
	 * @param {StructuredNode} node The node.
	 * @param {string} text         The text to append.
	 *
	 * @returns {void}
	 *
	 * @private
	 */
	static _addStructuredNodeText( node, text ) {
		// Get the previous sibling of this node.
		const prevChild = node.children[ node.children.length - 1 ];
		/*
		  If the previous child is an implicit paragraph, append the text to it,
		  instead of creating a new one in the explicit case.

		  E.g. implicit case: "This is a " + "paragraph" => "This is a paragraph"
		  Explicit case: "<p>This is not a <p>" + "paragraph" => "<p>This is not a <p>paragraph"
		 */
		if ( prevChild && prevChild instanceof Paragraph && ! prevChild.isExplicit() ) {
			// Append text to the paragraph.
			prevChild.textContainer.appendText( text );
		} else {
			// Else: wrap the text in an implicit paragraph and add it as a new child.
			const paragraph = new Paragraph();
			paragraph.textContainer.appendText( text );
			paragraph.parent = node;
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
	 * @param {Node} node The node from which to retrieve the parent.
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
	 * @param {Node} node The node to get the children from.
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
	 * @param {Node} node The node to get its first child from.
	 *
	 * @returns {Node[]|null} The node's first child or null, if this node cannot get any children.
	 */
	getFirstChild( node ) {
		if ( node.children && node.children.length > 0 ) {
			return node.children[ 0 ];
		}
		return null;
	}

	// Node source location.

	/**
	 * Sets the node's location as found in the source code.
	 *
	 * More often than not this is not the entire info
	 * and misses the location of the end tag...
	 *
	 * We still need to add it, since `parse5` appends the end tag position
	 * to this object somewhere during parsing (after `createElement` and before `appendChild`).
	 *
	 * @param {Node} node         The node to set its location.
	 * @param {Location} location The node's location in the source code.
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
	 * @param {Node} node The node to get its source code location from.
	 *
	 * @returns {Location|void} The node's source code location.
	 */
	getNodeSourceCodeLocation( node ) {
		if ( ! node ) {
			return;
		}
		return node.location;
	}

	// Private utility methods.

	/**
	 * Finds the most recent leaf node ancestor (parent of parent of ... ) of the given element.
	 * (A leaf node is a node that may only contain text and formatting elements, like a heading or a paragraph).
	 *
	 * @see module:tree/structure.LeafNode.
	 *
	 * @param {Node|FormattingElement} element  The node to find the ancestor of.
	 *
	 * @returns {Node|null} The most recent ancestor that returns true on the given predicate, or `null` if no appropriate ancestor is found.
	 *
	 * @private
	 */
	static _findAncestorLeafNode( element ) {
		let parent = element.parent;
		/*
		  Go up the tree until we either find the element we want,
		  or until we are at the root of the tree (an element with no parent).
		 */
		while ( ! ( parent instanceof LeafNode ) && parent !== null ) {
			parent = parent.parent;
		}
		return parent;
	}
}

export default TreeAdapter;
