/**
 * Finds all nodes in the tree that satisfies the given condition.
 *
 * @param {Object} 		tree 						The tree.
 * @param {function} 	condition 					The condition that a node should satisfy to end up in the list.
 * @param {boolean} 	recurseFoundNodes=false 	Whether to recurse into found nodes to see if the condition also applies to
 * sub-nodes of the found node.
 * If false, as soon as a node is found that satisfies the condition, it is added to the list and no further recursion is done through its children.
 * If true, the node is added to the list and its children are also checked for the condition.
 * If they satisfy the condition, they are also added to the list.
 * This comes with the risk of adding the same node multiple times to the list.
 *
 * Example:
 * HTML: <div><div><div>foo</div></div></div>
 * Condition: node => node.nodeName === 'div'
 * If recurseFoundNodes is false, this will return: [ <div><div><div>foo</div></div></div> ]
 *
 * If recurseFoundNodes is true, this will return: [ <div><div><div>foo</div></div></div>, <div><div>foo</div></div>, <div>foo</div> ]
 *
 * In assessments where you want to count the number of occurrences of a certain type of node, you should set recurseFoundNodes to false.
 * For example in the list assessment with a nested list: you only want to count the outer list.
 *
 * <ul>
 *   <li>Coffee</li>
 *   <li>Tea
 *     <ul>
 *       <li>Black tea</li>
 *       <li>Green tea</li>
 *     </ul>
 *   </li>
 *   <li>Milk</li>
 * </ul>
 *
 * In getTextElementPositions, you want to find all descendant nodes that have position information.
 * In this case you want to recurse into found nodes.
 *
 * @returns {Object[]} The list of nodes that satisfy the condition.
 */
export default function findAllInTree( tree, condition, recurseFoundNodes = false ) {
	const nodes = [];

	if ( ! tree.childNodes ) {
		return nodes;
	}

	tree.childNodes.forEach( child => {
		if ( condition( child ) ) {
			nodes.push( child );
			if ( recurseFoundNodes ) {
				nodes.push( ...findAllInTree( child, condition, recurseFoundNodes ) );
			}
		} else {
			nodes.push( ...findAllInTree( child, condition, recurseFoundNodes ) );
		}
	} );

	return nodes;
}
