import Heading from "../values/nodes/Heading";
import Paragraph from "../values/nodes/Paragraph";
import StructuredNode from "../values/nodes/StructuredNode";
import TextContainer from "../values/nodes/TextContainer";

const irrelevantHtmlElements = [ "script", "style", "pre" ];
const headings = [ "h1", "h2", "h3", "h4", "h5", "h6" ];

class NewTreeAdapter {
	// Creation of nodes and other tree elements.

	createElement( tag, namespace ) {
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
		node.parent = null;

		return node;
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
			// Add text to the heading or paragraph.
			node.textContainer.appendText( text );
		} else {
			// Get the previous sibling of this node.
			const prevChild = node.parent.children[ node.parent.children.length - 1 ];
			// If the previous child is a paragraph...
			if ( prevChild && prevChild instanceof Paragraph ) {
				// Append text to the paragraph.
				prevChild.textContainer.appendText( text );
			} else {
				// Else: wrap the text in a (implicit) paragraph and add it to the tree.
				const paragraph = new Paragraph();
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
		/*
		  Some node types do not have children (like Paragraph and Heading),
		  but parse5 always expects a node to have children.
		 */
		return node.children || [];
	}

	getFirstChild( node ) {
		return node.children[ 0 ] || null;
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
