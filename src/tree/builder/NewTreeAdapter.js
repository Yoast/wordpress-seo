

class NewTreeAdapter {
	// Creation of nodes and other tree elements.

	createElement( tag, namespace, attributes ) {
		return {
			tag,
			namespace,
			attributes,
			parent: null,
			children: [],
		};
	}

	createTextNode( text ) {
		return {
			tag: "#text",
			value: text,
			parent: null,
		};
	}

	createDocumentFragment() {
		return {
			tag: "#document-fragment",
			children: [],
		};
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
			const prevNode = node.parent.children[ node.parent.children.length - 1 ];

			if ( prevNode.tag === "#text" ) {
				prevNode.value += text;
				return;
			}
		}

		this.appendChild( node, this.createTextNode( text ) );
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
		node.location = location;
	}

	getNodeSourceCodeLocation( node ) {
		return node.location;
	}
}

export default NewTreeAdapter;
