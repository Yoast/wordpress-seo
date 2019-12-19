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
	 * @param {Node}     convertedTree The tree in progress.
	 * @param {LeafNode} lastLeafNode  The last leaf node that was added to the tree.
	 *
	 * @returns {void}
	 *
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

				if ( ignoredHtmlElements.includes( nodeType ) ) {
					const previousChild = this._previousChild( convertedTree );
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );

					// Ignored, (nested) within a leaf node.
					if ( hasLeafNodeAncestor ) {
						/*
						  Ignored element, (nested) within a leaf node:
						  E.g.
						  ```html
							<div>
								<p> // convertedTree
									<strong>
									   <!-- comment --> // ignored element, added as formatting to the paragraph.
									</strong>
								</p>
							</div>
						  ```
						 */
						lastLeafNode.addFormatting( formatting );
					} else if ( previousChild && previousChild instanceof Paragraph && previousChild.isImplicit ) {
						/*
						  We want to merge chains of implicit paragraphs together.
						  E.g.
						  ```html
							 <div> // convertedTree
								 [p] Hello
								 <!-- comment -->
							 </div>
						  ```
						  Should become:
						  ```html
							 <div> // convertedTree
								 [p] // previousChild
									 Hello
									 <!-- comment --> // formatting added to implicit paragraph.
								 [/p]
							 </div>
						  ```
						 */
						previousChild.addFormatting( formatting );
						child = convertedTree;
					}
				} else if ( nodeType === "p" ) {
					// Paragraph.
					child = new Paragraph( node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.addChild( child );
				} else if ( headings.includes( nodeType ) ) {
					// Heading.
					child = new Heading( parseInt( nodeType[ 1 ], 10 ), node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.addChild( child );
				} else if ( nodeType === "li" ) {
					// List item.
					child = new ListItem( node.sourceCodeLocation );
					lastLeafNode = child;
					convertedTree.addChild( child );
				} else if ( nodeType === "ol" || nodeType === "ul" ) {
					// List node.
					child = new List( nodeType === "ol", node.sourceCodeLocation );
					convertedTree.addChild( child );
				} else if ( nodeType === "#text" && ! hasIgnoredAncestor && hasLeafNodeAncestor ) {
					/*
					 * == Text inside leaf node (paragraph, heading, list item). ==
					 *
					 * We add the text to the nearest leaf node ancestor.
					 * E.g.
					 * ```html
					 *	 <p> // ancestorLeafNode of node
					 *	    A text with
					 *		<em>
					 *		  <strong>
					 *			 <a> a bold link. </a> // node: <a>, text: 'a bold link'.
					 *		  </strong>
					 *		</em>
					 *	 </p>
					 *  ```
					 *  'a bold link.' should be added as text to `<p>`, not `<a>`
					 *  to complete the sentence and make analysis of the text easier.
					 */
					lastLeafNode.appendText( node.value );
				} else if ( nodeType === "#text" && ! hasLeafNodeAncestor && ! hasIgnoredAncestor ) {
					// Orphaned text: text **not** within a leaf node.
					const previousChild = this._previousChild( convertedTree );

					if ( convertedTree instanceof Paragraph ) {
						/*
						   Nested orphaned text.
						   E.g.
						  ```html
						    <div>
						    	[p] // convertedTree
						    	    <strong>
						    	       <em>
						    	          World // #text
						    	       </em>
						    	    </strong>
						    	[/p]
						    </div>
						  ```
						 */
						convertedTree.appendText( node.value );
						child = convertedTree;
					} else if ( previousChild && previousChild instanceof Paragraph && previousChild.isImplicit ) {
						/*
						  We want to merge chains of implicit paragraphs together.
						  E.g.
						  ```html
							 <div> // parent
								 [p] Hello
								 <strong> [/p] // prevChild, with empty formatting already added.
								   World!  // text, needs to be added to implicit paragraph.
								 </strong>
							 </div>
						  ```
						  Should become:
						  ```html
							 <div> // parent
								 [p] // prevChild
									 Hello
									 <strong>
									   World! // text added to previousChild.
									 </strong>
								 [/p]
							 </div>
						  ```
						 */
						previousChild.appendText( node.value );
						child = convertedTree;
					} else {
						// Orphaned text, without preceding orphaned siblings.
						child = new Paragraph( node.sourceCodeLocation, true );
						convertedTree.addChild( child );
						lastLeafNode = child;
						lastLeafNode.appendText( node.value );
					}
				} else if ( formattingElements.includes( nodeType ) && ! hasLeafNodeAncestor ) {
					// Orphaned formatting element.
					const formatting = new FormattingElement( nodeType, node.sourceCodeLocation, this._parseAttributes( node.attrs ) );

					const previousChild = this._previousChild( convertedTree );

					if ( convertedTree instanceof Paragraph ) {
						/*
						  Nested orphaned formatting elements:
						  E.g.
						  ```html
						    <div>
						    	[p] // convertedTree
						    	    <strong>
						    	       <em> // formatting.
						    	          World
						    	       </em>
						    	    </strong>
						    	[/p]
						    </div>
						  ```
						 */
						convertedTree.addFormatting( formatting );
						child = convertedTree;
					} else if ( previousChild && previousChild instanceof Paragraph && previousChild.isImplicit ) {
						/*
						  We want to merge chains of implicit paragraphs together.
						  E.g.
						  ```html
							 <div> // parent
								 [p] Hello [/p] // prevChild
								 <strong> World! </strong> // child
							 </div>
						  ```
						  Should become:
						  ```html
							 <div> // parent
								 [p] // prevChild
									 Hello
									 <strong> World! </strong> // formatting added to prevChild
								 [/p]
							 </div>
						  ```
						 */
						previousChild.addFormatting( formatting );
						child = convertedTree;
					} else {
						// Orphaned formatting element, without preceding orphaned siblings.
						child = new Paragraph( node.sourceCodeLocation, true );
						convertedTree.addChild( child );
						lastLeafNode = child;
						lastLeafNode.addFormatting( formatting );
					}
				} else if ( formattingElements.includes( nodeType ) ) {
					/*
					 * Leaf nodes (paragraphs and headings) may not have any children.
					 * We add the formatting element instead to the nearest leaf node ancestor.
					 * E.g.
					 * ```html
					 *    <p> // ancestorLeafNode of child
					 *       <em>
					 *         <strong> // parent
					 *            <a> A bold link. </a> // child
					 *         </strong>
					 *       </em>
					 *    </p>
					 *  ```
					 *  `<a>` should be added as formatting to `<p>`.
					 */
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
