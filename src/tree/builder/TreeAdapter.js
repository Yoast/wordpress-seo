import Heading from "../values/nodes/Heading";
import List from "../values/nodes/List";
import ListItem from "../values/nodes/ListItem";
import Paragraph from "../values/nodes/Paragraph";
import StructuredIrrelevant from "../values/nodes/StructuredIrrelevant";
import StructuredNode from "../values/nodes/StructuredNode";
import TextContainer from "../values/nodes/TextContainer";

const irrelevantHtmlElements = [ "script", "style", "pre" ];
const headings = [ "h1", "h2", "h3", "h4", "h5", "h6" ];

/**
 * Class used to build a Structured Tree, to be used in further analysis.
 *
 * Implements the `TreeAdapter` interface of the `parse5` library.
 * @see https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/tree-adapter/interface.md
 */
class TreeAdapter {
	/**
	 * Creates a new node for in the tree.
	 *
	 * @param {string} tagName		The tag name of the html-element as parsed by the parse5 library.
	 * @returns {Node} The new node.
	 */
	createElement( tagName ) {
		let node;

		if ( irrelevantHtmlElements.includes( tagName ) ) {
			/*
		     Check if this element is irrelevant for analysis
		     and should not be expanded.
		    */
			node = new StructuredIrrelevant( tagName );
		} else if ( headings.includes( tagName ) ) {
			// Heading.
			const headingLevel = tagName[ 1 ];
			node = new Heading( parseInt( headingLevel, 10 ) );
		} else if ( tagName === "p" ) {
			// Paragraph.
			node = new Paragraph( "p" );
		} else if ( tagName === "ul" || tagName === "ol" ) {
			// List (ordered/unordered).
			node = new List( tagName === "ol" );
		} else if ( tagName === "li" ) {
			// List item.
			node = new ListItem();
		} else {
			// Everything else.
			node = new StructuredNode( tagName );
		}

		return node;
	}

	/**
	 * Inserts the given text into the parent node, if the parent node may
	 * only accept phrasing content (like a heading or a paragraph).
	 * If not, a new paragraph is created (if none has been created yet)
	 * and the text is added to the new paragraph instead.
	 *
	 * @param {Node} parentNode	The parent node to add the text to.
	 * @param {string} text		The text to add.
	 * @returns {void}
	 */
	insertText( parentNode, text ) {
		if ( parentNode instanceof Heading || parentNode instanceof Paragraph ) {
			/*
			  Headings and paragraphs may only contain phrasing content,
			  assume this is the case. (?)
			 */
			if ( ! parentNode.textContainer ) {
				parentNode.textContainer = new TextContainer();
			}
			parentNode.textContainer.appendText( text );
		} else {
			// Get the previous child of the parent.
			const prevChild = parentNode.children[ parentNode.children.length - 1 ];

			// If the previous child is a paragraph...
			if ( prevChild && prevChild instanceof Paragraph ) {
				// Append text to the paragraph.
				prevChild.textContainer.appendText( text );
			} else {
				// Else: make a new paragraph.
				const paragraph = new Paragraph();
				// This can be refactored...
				paragraph.textContainer = new TextContainer();
				paragraph.textContainer.appendText( text );
				parentNode.children.push( paragraph );
			}
		}
	}

	// createDocument() {
	//
	// }

	/**
	 * Creates a new document fragment node.
	 * This node is used as the root for a parsed html fragment.
	 *
	 * @returns {StructuredNode} The node to use as the root of a parsed html document fragment.
	 */
	createDocumentFragment() {
		return new StructuredNode( "root" );
	}
	//
	// createCommentNode( data ) {
	//
	// }
	//
	// createTextNode( value ) {
	//
	// }

	/**
	 * Appends a node to a parent as a child node.
	 *
	 * @param {Node} parentNode	The parent node to append the child to.
	 * @param {Node} newNode		The node to append as a child to the parent.
	 *
	 * @returns {void}
	 */
	appendChild( parentNode, newNode ) {
		parentNode.children.push( newNode );
		newNode.parent = parentNode;
	}
	//
	// insertBefore( parentNode, newNode, referenceNode ) {
	//
	// }
	//
	// setTemplateContent( templateElement, contentElement ) {
	//
	// }
	//
	// getTemplateContent( templateElement ) {
	//
	// }
	//
	// setDocumentType( document, name, publicId, systemId ) {
	//
	// }
	//
	// setDocumentMode( document, mode ) {
	//
	// }
	//
	// getDocumentMode( document ) {
	//
	// }

	/**
	 * Detaches the given node from its parent.
	 *
	 * @param {Node} node	The node to detach.
	 *
	 * @returns {void}
	 */
	detachNode( node ) {
		if ( node.parent ) {
			// Get node's index in the children of its parent.
			const index = node.parent.children.indexOf( node );
			// Remove child from its parents :'(.
			node.parent.children.splice( index, 1 );
			node.parent = null;
		}
	}
	//
	// insertTextBefore( parentNode, text, referenceNode ) {
	//
	// }
	//
	// adoptAttributes( recipient, attrs ) {
	//
	// }
	//
	// // Tree traversing

	/**
	 * Gets the first child of the given node.
	 *
	 * @see https://en.wikipedia.org/wiki/Rumpelstiltskin
	 *
	 * @param {Node} node	The node from which to get the first child.
	 *
	 * @returns {Node} The first child of the given node.
	 */
	getFirstChild( node ) {
		return node.children[ 0 ];
	}

	/**
	 * Gets the children of the given node.
	 *
	 * @param {Node} node	The node from which to get the children.
	 *
	 * @returns {Node[]} The children of the given node.
	 */
	getChildNodes( node ) {
		return node.children;
	}

	getParentNode( node ) {
		return node.parent;
	}

	getAttrList( element ) {
		return null;
	}

	// Node data

	/**
	 * Returns the type of the given node (e.g. "Paragraph", "StructuredNode", "Heading" ).
	 *
	 * @param {Node} node	The node from which to get the type.
	 *
	 * @returns {string} The node type.
	 */
	getTagName( node ) {
		return node.type;
	}

	getNamespaceURI() {
		return "";
	}
	//
	// getTextNodeContent( textNode ) {
	//
	// }
	//
	// getCommentNodeContent( commentNode ) {
	//
	// }
	//
	// getDocumentTypeNodeName( doctypeNode ) {
	//
	// }
	//
	// getDocumentTypeNodePublicId( doctypeNode ) {
	//
	// }
	//
	// getDocumentTypeNodeSystemId( doctypeNode ) {
	//
	// }
	//
	// // Node types
	//
	// isTextNode( node ) {
	//
	// }
	//
	// isCommentNode( node ) {
	//
	// }
	//
	// isDocumentTypeNode( node ) {
	//
	// }
	//
	// isElementNode( node ) {
	//
	// }
	//
	// Source code location

	/**
	 * Sets the node's source code location (as parsed by parse5).
	 *
	 * @param {Node} node			The node for which to set the source code location.
	 * @param {Location} location	The location of this node in the source code.
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
	 * Returns the given node's source code location (as parsed by parse5).
	 *
	 * @param {Node} node	The node from which to get the location.
	 * @returns {Location} The node's source code location.
	 */
	getNodeSourceCodeLocation( node ) {
		return node ? node.location : null;
	}
}
export default TreeAdapter;
