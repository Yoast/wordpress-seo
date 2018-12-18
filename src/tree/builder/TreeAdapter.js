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

class TreeAdapter {
	// Creation of nodes and other tree elements.

	createElement( tag, namespace, attributes ) {
		let node;

		if ( irrelevantHtmlElements.includes( tag ) ) {
			// Irrelevant for analysis (e.g. `script`, `style`).
			node = new StructuredIrrelevant( tag );
		} else if ( formattingElements.includes( tag ) ) {
			// Formatting element.
			const parsedAttributes = this._parseAttributes( attributes );
			node = new FormattingElement( tag, parsedAttributes );
		} else if ( headings.includes( tag ) ) {
			// Heading.
			node = new Heading( parseInt( tag[ 1 ], 10 ) );
		} else if ( tag === "p" ) {
			// Paragraph.
			node = new Paragraph( tag );
		} else if ( tag === "ol" || tag === "ul" ) {
			// List.
			node = new List( tag === "ol" );
		} else if ( tag === "li" ) {
			// List item.
			node = new ListItem();
		} else {
			// All other elements (`div`, `section`).
			node = new StructuredNode( tag );
		}

		node.tagName = tag;
		node.namespace = namespace;
		node.parent = null;

		return node;
	}

	/**
	 * Parses the HTML element attributes from parse5's format to a plain JS object.
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

	createDocumentFragment() {
		return new StructuredNode( "root" );
	}

	createCommentNode( text ) {
		const node = new StructuredIrrelevant( "comment" );
		node.parent = null;
		node.content = text;
		return node;
	}

	// Tree manipulation.

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
		} else if ( node instanceof FormattingElement ) {
			// Formatting element.
			// Hoist element up the tree until it encounters a paragraph or heading.
			let parent = node.parent;
			while ( ! ( parent instanceof Paragraph || parent instanceof Heading ) ) {
				parent = parent.parent;
			}
			// Append text to parent's text container.
			parent.textContainer.appendText( text );
		} else {
			// Get the previous sibling of this node.
			const prevChild = node.children[ node.children.length - 1 ];
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
		return node.tagName;
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

export default TreeAdapter;
