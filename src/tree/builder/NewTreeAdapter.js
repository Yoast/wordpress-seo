import Heading from "../values/nodes/Heading";
import Paragraph from "../values/nodes/Paragraph";
import StructuredNode from "../values/nodes/StructuredNode";

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
		if ( node.children.length ) {
			const prevNode = node.children[ node.children.length - 1 ];

			if ( prevNode.tag === "#text" ) {
				prevNode.value += text;
				return;
			}
		}

		this.appendChild( node, this.createTextNode( text ) );
	}

	// Node getters and setters.

	getTagName( node ) {
		/*
		  Structured Node's can be identified by tag,
		  elements with their own class (Header, Paragraph)
		  can be identified by their 'type' parameter.
		  (Structured Node's type is always 'structuredNode').
		 */
		return node.tag || node.type;
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
		node.location = location;
	}

	getNodeSourceCodeLocation( node ) {
		return node.location;
	}
}

export default NewTreeAdapter;
