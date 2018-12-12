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
 * Implements the `TreeAdapter` of the `parse5` library.
 * @see https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/tree-adapter/interface.md
 */
class TreeAdapter {
	constructor() {
		this.currentParentNode = null;
	}

	createElement( tagName, namespaceURI, attrs ) {
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

		/*
		  Set parent node (used for 'detach' method below,
		  which parse5 uses to construct the tree.
		  (Perhaps we have a better option).
		 */
		node.parent = this.currentParentNode;
		this.currentParentNode = node;

		return node;
	}

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
			if ( prevChild && prevChild.type === "paragraph" ) {
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

	appendChild( parentNode, newNode ) {
		parentNode.children.push( newNode );
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

	detachNode( node ) {
		if ( node.parent ) {
			// Get node's index in the children of its parent.
			const index = node.parent.children.indexOf( node );
			// Remove child from its parents :'(.
			node.parent.children.splice( index, 1 );
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

	getFirstChild( node ) {
		return node.children[ 0 ];
	}

	getChildNodes( node ) {
		return node.children;
	}

	getParentNode( node ) {
		return null;
	}

	getAttrList( element ) {
		return null;
	}
	//
	// //Node data

	getTagName( element ) {
		return element.type;
	}

	getNamespaceURI( element ) {
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
	// // Source code location

	setNodeSourceCodeLocation( node, location ) {
		node.location = location;
	}

	getNodeSourceCodeLocation( node ) {
		return node.location;
	}
}
export default TreeAdapter;
