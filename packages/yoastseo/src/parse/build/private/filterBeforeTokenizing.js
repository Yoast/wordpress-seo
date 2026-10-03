import { isEmpty } from "lodash";
import { canBeChildOfParagraph as excludeFromAnalysis } from "./alwaysFilterElements";

/**
 * Removes all child nodes from nodes that we want to exclude from the analysis, and that can be children of a paragraph
 * or heading.
 *
 * The child nodes are removed because we don't want to include any text between those nodes in the analysis.
 * If we don't remove them here, the text between those nodes will be considered as part of the paragraph's
 * inner text and will be tokenized.
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
	if ( excludeFromAnalysis.includes( node.name ) ) {
		node.childNodes = [];
	}

	// Recursively filters the node's children.
	if ( ! isEmpty( node.childNodes ) ) {
		node.childNodes.map( filterBeforeTokenizing );
	}

	return node;
}
