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

				// Ignored, do not add to tree since we do not analyze it.
				if( ignoredHtmlElements.includes( nodeType ) ) {
					continue;
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

				if( nodeType === "#text" ) {
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
}

export default HTMLTreeConverter;
