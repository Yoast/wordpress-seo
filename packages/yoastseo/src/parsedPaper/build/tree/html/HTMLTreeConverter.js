import { FormattingElement, Heading, Paragraph, StructuredNode } from "../../../structure/tree";
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
		if( parse5Tree.childNodes ) {
			for( let node of parse5Tree.childNodes ) {

				const nodeType = node.nodeName;
				const hasIgnoredAncestor = this._hasIgnoredAncestor( node );
				const hasLeafNodeAncestor = this._hasLeafNodeAncestor( node );

				// Ignored, do not add to tree since we do not analyze it.
				if( ignoredHtmlElements.includes( nodeType ) && hasLeafNodeAncestor ) {
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );
					lastLeafNode.textContainer.formatting.push( formatting );
				}

				// Paragraph.
				if( nodeType === "p" ) {
					const child = new Paragraph( node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.children.push( child );
				}

				// Heading.
				if( headings.includes( nodeType ) ) {
					const child = new Heading( parseInt( nodeType[ 1 ], 10 ), node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.children.push( child );
				}

				if( nodeType === "#text" && ! hasIgnoredAncestor ) {
					lastLeafNode.textContainer.appendText( node.value );
				}

				if( formattingElements.includes( nodeType ) ) {
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );
					lastLeafNode.textContainer.formatting.push( formatting );
				}

				console.log( "node", node );
				this._convert( node, convertedTree, lastLeafNode );
			}
		}
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
		return nodeType === "p" || headings.includes( nodeType );
	}
}

export default HTMLTreeConverter;
