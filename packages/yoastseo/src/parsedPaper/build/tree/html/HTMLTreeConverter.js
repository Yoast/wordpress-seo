import { FormattingElement, Heading, Paragraph, StructuredNode, List, ListItem } from "../../../structure/tree";
import LeafNode from "../../../structure/tree/nodes/LeafNode";
import { formattingElements, headings, ignoredHtmlElements } from "./htmlConstants";

class HTMLTreeConverter {
	/**
	 *
	 * @param parse5Tree
	 */
	convert( parse5Tree ) {
		const root = new StructuredNode( "root" );
		this._convert( parse5Tree, root, null );
		return root;
	}

	/**
	 * Converts the tree from a parse5 implementation to a Yoast tree.
	 * @param {Object}   parse5Tree    The parse5 tree to convert.
	 * @param {Node}     parent The tree in progress.
	 * @param {LeafNode} lastLeafNode  The last leaf node that was added to the tree.
	 *
	 * @returns {void}
	 *
	 * @private
	 */
	_convert( parse5Tree, parent, lastLeafNode ) {
		if ( parse5Tree.childNodes ) {
			for ( const node of parse5Tree.childNodes ) {
				const nodeType = node.nodeName;

				let child;

				if ( ignoredHtmlElements.includes( nodeType ) ) {
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );
					this._addContent( formatting, this._addFormatting, parent, node.sourceCodeLocation );
				} else if ( nodeType === "p" ) {
					// Paragraph.
					child = new Paragraph( node.sourceCodeLocation );
				} else if ( headings.includes( nodeType ) ) {
					// Heading.
					child = new Heading( parseInt( nodeType[ 1 ], 10 ), node.sourceCodeLocation );
				} else if ( nodeType === "li" ) {
					// List item.
					child = new ListItem( node.sourceCodeLocation );
				} else if ( nodeType === "ol" || nodeType === "ul" ) {
					// List node.
					child = new List( nodeType === "ol", node.sourceCodeLocation );
				} else if ( nodeType === "#text" ) {
					const newParagraph = this._addContent( node.value, this._addText, parent, node.sourceCodeLocation );

					if ( newParagraph ) {
						child = newParagraph;
					}
				} else if ( formattingElements.includes( nodeType ) ) {
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );

					const newParagraph = this._addContent( formatting, this._addFormatting, parent, node.sourceCodeLocation );

					if ( newParagraph ) {
						child = newParagraph;
					}
				} else {
					child = new StructuredNode( nodeType, node.sourceCodeLocation );
				}

				if ( child ) {
					parent.addChild( child );
					parent = child;
					lastLeafNode = child instanceof LeafNode ? child : lastLeafNode;
				}

				this._convert( node, parent, lastLeafNode );
			}
		}
	}

	_addContent( contentToAdd, add, parent, location ) {
		const previousChild = this._previousChild( parent );
		const leafNodeAncestor = this._leafNodeAncestor( parent );

		if ( leafNodeAncestor instanceof Paragraph ) {
			add( leafNodeAncestor, contentToAdd );
			return null;
		} else if ( previousChild && previousChild instanceof Paragraph && previousChild.isImplicit ) {
			add( previousChild, contentToAdd );
			return null;
		}

		const child = new Paragraph( location, true );
		add( child, contentToAdd );
		return child;
	}

	_addText( parent, text ) {
		parent.appendText( text );
	}

	_addFormatting( parent, formatting ) {
		parent.addFormatting( formatting );
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
	_parseAttributes( parse5attributes ) {
		if ( parse5attributes && parse5attributes.length > 0 ) {
			return parse5attributes.reduce( ( attributes, attribute ) => {
				attributes[ attribute.name ] = attribute.value;
				return attributes;
			}, {} );
		}
		return null;
	}

	/**
	 * Returns the last child of the given parent.
	 *
	 * @param {Node} parent The parent.
	 *
	 * @returns {Node} The parent's last child.
	 *
	 * @private
	 */
	_previousChild( parent ) {
		if ( parent.children ) {
			return parent.children[ parent.children.length - 1 ];
		}
		return null;
	}

	_leafNodeAncestor( element ) {
		const parent = element.parentNode;

		if ( ! parent ) {
			return null;
		}

		if ( this._isLeafNode( parent ) ) {
			return parent;
		}

		return this._leafNodeAncestor( parent );
	}

	_isLeafNode( parse5Node ) {
		const nodeType = parse5Node.nodeName;
		return nodeType === "p" || headings.includes( nodeType ) || nodeType === "li";
	}
}

export default HTMLTreeConverter;
