import Heading from "../values/nodes/Heading";
import Paragraph from "../values/nodes/Paragraph";
import StructuredNode from "../values/nodes/StructuredNode";
import TextContainer from "../values/nodes/TextContainer";

const irrelevantHtmlElements = [ "script", "style", "pre" ];
const headings = [ "h1", "h2", "h3", "h4", "h5", "h6" ];

class NewTreeAdapter {
	// Creation of nodes and other tree elements.

	createElement( tag, namespace, attributes ) {
		let node;

		if ( headings.includes( tag ) ) {
			// Heading.
			node = new Heading( parseInt( tag[ 1 ], 10 ) );
		} else if ( tag === "p" ) {
			// Paragraph.
			node = new Paragraph( tag );
		} else {
			// Structured node.
			node = new StructuredNode( tag );
		}

		node.tag = tag;
		node.namespace = namespace;
		node.attributes = attributes;
		node.parent = null;
		node.children = [];

		return node;
	}

	createTextNode( text ) {
		return {
			tag: "#text",
			value: text,
			parent: null,
		};
	}

	createDocumentFragment() {
		return new StructuredNode( "root" );
	}

	// Tree manipulation.

	appendChild( parent, child ) {
		parent.children.push( child );
		child.parent = parent;
	}

	detachNode( node ) {
		if ( node.parent ) {
			const index = node.parent.children.indexOf( node );
			node.parent.children.splice( index, 1 );
			node.parent = null;
		}
	}

	insertText( node, text ) {
		if ( node instanceof Heading || node instanceof Paragraph ) {
			// Add text to node's textContainer, make one if it does not exist yet.
			if ( ! node.textContainer ) {
				node.textContainer = new TextContainer();
			}
			node.textContainer.appendText( text );
		} else {
			// Get the previous sibling of this node.
			const prevChild = node.parent.children[ node.parent.children.length - 1 ];
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
				node.children.push( paragraph );
			}
		}
	}

	// Node getters and setters.

	getTagName( node ) {
		return node.tag;
	}

	getNamespaceURI( node ) {
		return node.namespace;
	}

	getParentNode( node ) {
		return node.parent;
	}

	getChildNodes( node ) {
		return node.children;
	}

	getFirstChild( node ) {
		return node.children[ 0 ];
	}

	// Node source location.

	setNodeSourceCodeLocation( node, location ) {
		if ( ! node ) {
			return;
		}
		node.location = location;
	}

	getNodeSourceCodeLocation( node ) {
		if ( ! node ) {
			return;
		}
		return node.location;
	}
}

export default NewTreeAdapter;
