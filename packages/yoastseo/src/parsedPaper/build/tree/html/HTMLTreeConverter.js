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
		console.log( "converted tree:", root );
		return root;
	}

	/**
	 *
	 * @param parse5Tree
	 * @param {StructuredNode} convertedTree
	 * @private
	 */
	_convert( parse5Tree, convertedTree, lastLeafNode ) {
		if ( parse5Tree.childNodes ) {
			for ( const node of parse5Tree.childNodes ) {

				const nodeType = node.nodeName;
				const hasIgnoredAncestor = this._hasIgnoredAncestor( node );
				const hasLeafNodeAncestor = this._hasLeafNodeAncestor( node );

				let child;

				console.log( { text: node.value, nodeType, convertedTree, hasLeafNodeAncestor, hasIgnoredAncestor } );

				if ( ignoredHtmlElements.includes( nodeType ) && hasLeafNodeAncestor ) {
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );
					lastLeafNode.addFormatting( formatting );
				} else if ( nodeType === "p" ) {
					child = new Paragraph( node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.addChild( child );
				} else if ( headings.includes( nodeType ) ) {
					child = new Heading( parseInt( nodeType[ 1 ], 10 ), node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.addChild( child );
				} else if ( nodeType === "li" ) {
					child = new ListItem( node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.addChild( child );
				} else if ( nodeType === "ol" || nodeType === "ul" ) {
					child = new List( nodeType === "ol", node.sourceCodeLocation );
					convertedTree.addChild( child );
				} else if ( nodeType === "#text" && ! hasIgnoredAncestor && hasLeafNodeAncestor ) {
					lastLeafNode.appendText( node.value );
				} else if ( nodeType === "#text" && ! hasLeafNodeAncestor && ! hasIgnoredAncestor ) {
					child = new Paragraph( node.sourceCodeLocation );
					convertedTree.addChild( child );
					lastLeafNode = child;
					lastLeafNode.appendText( node.value );
				} else if ( formattingElements.includes( nodeType ) && ! hasLeafNodeAncestor ) {
					// Orphaned formatting element.
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );
					child = new Paragraph( node.sourceCodeLocation, true );
					convertedTree.addChild( child );
					lastLeafNode = child;
					lastLeafNode.addFormatting( formatting );
				} else if ( formattingElements.includes( nodeType ) ) {
					// Formatting element.
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );
					lastLeafNode.addFormatting( formatting );
				} else if ( nodeType !== "#text" && ! ignoredHtmlElements.includes( nodeType ) ) {
					child = new StructuredNode( nodeType, node.sourceCodeLocation );
					convertedTree.addChild( child );
				}

				this._convert( node, child, lastLeafNode );
			}
		}
	}

	_addChild( tree, child ) {
		child.parent = tree;
		tree.children.push( child );
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
	 * Finds the most recent leaf node ancestor (parent of parent of ... ) of the given element.
	 * (A leaf node is a node that may only contain text and formatting elements, like a heading or a paragraph).
	 *
	 * @see module:parsedPaper/structure.LeafNode.
	 *
	 * @param {module:parsedPaper/structure.Node|module:parsedPaper/structure.FormattingElement} element  The node to find the ancestor of.
	 *
	 * @returns {module:parsedPaper/structure.Node|null} The most recent ancestor that returns true on the given predicate,
	 *                                            or `null` if no appropriate ancestor is found.
	 *
	 * @private
	 */
	_hasIgnoredAncestor( element ) {
		const parent = element.parentNode;

		if ( ! parent ) {
			return false;
		}

		if ( ignoredHtmlElements.includes( parent.nodeName ) ) {
			return true;
		}

		return this._hasIgnoredAncestor( parent );
	}


	_hasLeafNodeAncestor( element ) {
		const parent = element.parentNode;

		if ( ! parent ) {
			return false;
		}

		if ( this._isLeafNode( parent ) ) {
			return true;
		}

		return this._hasLeafNodeAncestor( parent );
	}

	_isLeafNode( parse5Node ) {
		const nodeType = parse5Node.nodeName;
		return nodeType === "p" || headings.includes( nodeType ) || nodeType === "li";
	}
}

export default HTMLTreeConverter;
