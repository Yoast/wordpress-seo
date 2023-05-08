import { isEmpty } from "lodash-es";

/**
 * Filters out 'text' child nodes and startTag and endTag properties of the sourceCodeLocation property of a node.
 *
 * @param {Node}	node	The node to filter.
 *
 * @returns {Node} The node without a `text` child node and without startTag and endTag properties.
 */
function filterNode( node ) {
	node.childNodes = node.childNodes.filter( childNode => childNode.name !== "#text" );
	delete node.sourceCodeLocation.startTag;
	delete node.sourceCodeLocation.endTag;

	return node;
}
/**
 * Removes the 'text' child nodes from 'code' and 'script' nodes, and the startTag and endTag properties of the
 * sourceCodeLocation of 'code' and 'script' nodes.
 *
 * The text child nodes are removed because we don't want to include text between 'code' and 'script' nodes in the analysis.
 * If we don't remove them here, the text between 'code' and 'script' nodes will be considered as part of the paragraph's
 * inner text and will be tokenized.
 *
 * The startTag and endTag properties are removed so that when sentence/token positions are calculated, the whole length
 * of the code/script element is considered when calculating the positions - not just the length of the tags.
 * For most other child nodes, we only need to add the length of the child nodes tags to the sentence/token positions
 * because what's in between those tags is part of the sentence/token itself. But in case of nodes like 'code' and 'script'
 * where the content is not part of the sentence/token, we need to add the length of the whole element to the
 * sentence/token positions. The way that the current algorithm for calculating positions works is that only if the child
 * node doesn't have startTag and endTag properties, the length of the whole element instead of just the tags is considered.
 *
 * These changes are only necessary for elements that can be children of paragraphs or headings. For example, we also
 * don't want to analyze content in between `blockquote` tags, but these cannot be children of paragraphs/headings.
 * Because of that, they wouldn't interfere with tokenizing the text inside paragraphs and headings and calculating
 * the positions.
 *
 * @param {Node} node The node to check.
 *
 * @returns {Node} The filtered out node that's ready to be tokenized.
 */
export function filterBeforeTokenizing( node ) {
	if ( node.name === "code" || node.name === "script" ) {
		node = filterNode( node );

		// Also delete the 'text' node and startTag and endTag properties of any of the node's children.
		if ( ! isEmpty( node.childNodes ) ) {
			node.childNodes.map( filterNode );
		}
	}

	// Recursively filters the node's children.
	if ( ! isEmpty( node.childNodes ) ) {
		node.childNodes.map( filterBeforeTokenizing );
	}

	return node;
}
