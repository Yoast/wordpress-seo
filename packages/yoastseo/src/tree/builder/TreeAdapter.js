// Tree elements.
import FormattingElement from "../structure/FormattingElement";
import Heading from "../structure/nodes/Heading";
import LeafNode from "../structure/nodes/LeafNode";
import List from "../structure/nodes/List";
import ListItem from "../structure/nodes/ListItem";
import Paragraph from "../structure/nodes/Paragraph";
import Ignored from "../structure/nodes/Ignored";
import StructuredNode from "../structure/nodes/StructuredNode";
// HTML classes.
import { formattingElements, headings, ignoredHtmlElements } from "./htmlConstants";

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
		if ( ignoredHtmlElements.includes( tag ) ) {
			// Ignored for analysis (e.g. `script`, `style`).
			node = new Ignored( tag );
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
		  (E.g. when it encounters a closing tag, it knows which element needs to be closed).
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
	 *
	 * @example
	 *
	 * const attributes = _parseAttributes( { name: "id", value: "an-id" } ) // becomes { id: "an-id" }.
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
	 * @returns {module:tree/structure.StructuredNode} A new empty document fragment.
	 */
	createDocumentFragment() {
		return new StructuredNode( "root" );
	}

	/**
	 * Creates a new node representing an HTML-comment.
	 *
	 * @param {string} text The comment text.
	 *
	 * @returns {module:tree/structure.Ignored} The node representing the comment.
	 */
	createCommentNode( text ) {
		const node = new Ignored( "comment" );
		node.parent = null;
		node.content = text;
		node.tagName = "comment";
		return node;
	}

	// Tree manipulation.

	/**
	 * Appends a child node to a parent node.
	 *
	 * @param {module:tree/structure.Node} parent The parent node.
	 * @param {module:tree/structure.Node} child  The child to add to the parent node.
	 *
	 * @returns {void}
	 */
	appendChild( parent, child ) {
		/*
		  Do not do anything with ignored content.
		  (We get the raw string contents later on from the source code).
		 */
		if ( parent instanceof Ignored ) {
			return;
		}

		child.parent = parent;

		/*
		 * Leaf nodes (paragraphs and headings) may not have any children.
		 * We add the child as formatting instead to the nearest leaf node ancestor.
		 * E.g.
		 * ```html
		 *    <p> // ancestorLeafNode of child
		 *       <em>
		 *         <strong> // parent
		 *            <a> A bold link. </a> // child
		 *         </strong>
		 *       </em>
		 *    </p>
		 *  ```
		 *  `<a>` should be added as formatting to `<p>`.
		 */
		const ancestorLeafNode = TreeAdapter._findAncestorLeafNode( parent );
		if ( ancestorLeafNode ) {
			ancestorLeafNode.textContainer.formatting.push( child );
			return;
		}

		if ( parent instanceof LeafNode ) {
			parent.textContainer.formatting.push( child );
			return;
		}

		/*
		 * Formatting elements (`strong`, `a` etc.) should always
		 * reside within a paragraph or heading.
		 * Make sure that it does.
		 */
		if ( child instanceof FormattingElement ) {
			const prevChild = parent.children[ parent.children.length - 1 ];
			if ( this._isImplicitParagraph( prevChild ) ) {
				/*
				  We want to merge chains of implicit paragraphs together.
				  E.g.
				  ```html
				     <div> // parent
				         [p] Hello [/p] // prevChild
				         <strong> World! </strong> // child
				     </div>
				  ```
				  Should become:
				  ```html
				     <div> // parent
				         [p] // prevChild
				             Hello
				             <strong> World! </strong> // formatting added to prevChild
				         [/p]
				     </div>
				  ```
				 */
				prevChild.textContainer.formatting.push( child );
				child.parent = prevChild;
			} else {
				/*
				  No implicit sibling paragraph to merge with,
				  wrap it in a new one, add it as formatting to the new paragraph.
				 */
				TreeAdapter._addOrphanedFormattingElement( parent, child );
			}
			return;
		}

		// Just add nodes to parent's children in any other case.
		child.parent = parent;
		parent.children.push( child );
	}

	/**
	 * Wraps a formatting element in a paragraph and adds the resulting paragraph to the given parent.
	 *
	 * @param {module:tree/structure.Node}              parent             The parent element to add the new paragraph to.
	 * @param {module:tree/structure.FormattingElement} formattingElement  The formatting element to wrap in a paragraph and add to the tree.
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
	 * @param {module:tree/structure.Node} node The node to detach from its parent.
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
	 * @param {module:tree/structure.Node} node   The node to (try to) append the text to.
	 * @param {string}                     text   The text to append to the node.
	 *
	 * @returns {void}
	 */
	insertText( node, text ) {
		// Do not add text to ignored nodes. We are going to add it later from the source text.
		if ( node instanceof Ignored ) {
			return;
		}

		/*
		 * We add the text to this node, if it is a leaf node (paragraph or header)
		 * or the nearest leaf node ancestor.
		 * E.g.
		 * ```html
		 *	 <p> // ancestorLeafNode of node
		 *	    A text with
		 *		<em>
		 *		  <strong>
		 *			 <a> a bold link. </a> // node: <a>, text: 'a bold link'.
		 *		  </strong>
		 *		</em>
		 *	 </p>
		 *  ```
		 *  'a bold link.' should be added as text to `<p>`, not `<a>`
		 *  to complete the sentence and make analysis of the text easier.
		 */
		const ancestorLeafNode = TreeAdapter._findAncestorLeafNode( node );
		if ( ancestorLeafNode ) {
			ancestorLeafNode.textContainer.appendText( text );
			return;
		}

		if ( node instanceof LeafNode ) {
			node.textContainer.appendText( text );
			return;
		}

		const prevChild = node.children[ node.children.length - 1 ];
		if ( this._isImplicitParagraph( prevChild ) ) {
			/*
			 * We want to merge chains of implicit paragraphs together.
			 * Same logic as in appending formatting elements as children applies (see `appendChild`).
			 */
			prevChild.textContainer.appendText( text );
		} else {
			// Else: wrap the text in an implicit paragraph and add it as a new child.
			const paragraph = new Paragraph();
			paragraph.textContainer.appendText( text );
			paragraph.parent = node;
			node.children.push( paragraph );
		}
	}

	/**
	 * If the given node is an implicit paragraph,
	 * e.g. a paragraph with no explicit start or opening tags.
	 *
	 * @param {module:tree/structure.Node} node The node to check.
	 *
	 * @returns {boolean} If the given node is an implicit paragraph.
	 *
	 * @private
	 */
	_isImplicitParagraph( node ) {
		return node && node instanceof Paragraph && ! node.isExplicit();
	}

	// Node getters and setters.

	/**
	 * Returns this node's tag name.
	 * (e.g. "h1", "p", "comment", "h3", "div")
	 *
	 * This is used by `parse5` to be able to differentiate between different
	 * behavior of HTML elements.
	 *
	 * @param {module:tree/structure.Node} node The node to get the tag name from.
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
	 * @param {module:tree/structure.Node} node The node to get the namespace URI from.
	 *
	 * @returns {string} The namespace URI of this node.
	 */
	getNamespaceURI( node ) {
		return node.namespace;
	}

	/**
	 * Gets the mode of the given element (e.g. "quirks", "no-quirks" or "limited-quirks").
	 *
	 * This is needed by the `parse5` library to be able to parse certain texts.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode
	 *
	 * @param {module:tree/structure.Node} element The element to set the mode of.
	 *
	 * @returns {void}
	 */
	getDocumentMode( element ) {
		return element.documentMode;
	}

	/**
	 * Sets the mode of the given element (e.g. "quirks", "no-quirks" or "limited-quirks").
	 *
	 * This is needed by the `parse5` library to be able to parse certain texts.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode
	 *
	 * @param {module:tree/structure.Node}            element         The element to set the mode of.
	 * @param {"no-quirks"|"quirks"|"limited-quirks"} mode            The mode to set.
	 *
	 * @returns {void}
	 */
	setDocumentMode( element, mode ) {
		element.documentMode = mode;
	}


	/**
	 * Returns this node's parent node.
	 *
	 * @param {module:tree/structure.Node} node The node from which to retrieve the parent.
	 *
	 * @returns {module:tree/structure.Node} The parent of this node.
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
	 * @param {module:tree/structure.Node} node The node to get the children from.
	 *
	 * @returns {module:tree/structure.Node[]} The children of the given node.
	 */
	getChildNodes( node ) {
		const formatting = node.textContainer ? node.textContainer.formatting : [];

		// If formatting is present, we return those when the last one is a comment.
		if ( formatting ) {
			const lastChild = formatting[ formatting.length - 1 ];
			if ( lastChild && lastChild.tag === "comment" ) {
				return formatting;
			}
		}

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
	 * @param {module:tree/structure.Node} node The node to get its first child from.
	 *
	 * @returns {module:tree/structure.Node[]|null} The node's first child or null, if this node cannot get any children.
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
	 * @param {module:tree/structure.Node} node         The node to set its location.
	 * @param {Object}                     location     The node's location in the source code.
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
	 * @param {module:tree/structure.Node} node The node to get its source code location from.
	 *
	 * @returns {Object|void} The node's source code location.
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
	 * @param {module:tree/structure.Node|module:tree/structure.FormattingElement} element  The node to find the ancestor of.
	 *
	 * @returns {module:tree/structure.Node|null} The most recent ancestor that returns true on the given predicate,
	 *                                            or `null` if no appropriate ancestor is found.
	 *
	 * @private
	 */
	static _findAncestorLeafNode( element ) {
		let parent = element.parent;
		/*
		  Go up the tree until we either find the element we want,
		  or until we are at the root of the tree (an element with no parent).
		 */
		while ( ! ( parent instanceof LeafNode ) && parent ) {
			parent = parent.parent;
		}
		return parent;
	}
}

export default TreeAdapter;
