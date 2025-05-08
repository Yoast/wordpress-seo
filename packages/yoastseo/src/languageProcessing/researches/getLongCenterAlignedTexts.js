import { intersection } from "lodash";

/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../parse/structure/").Node} Node
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * The maximum allowed length of a center-aligned paragraph or heading in characters.
 * @type {number}
 */
const MAX_CENTER_ALIGNED_LENGTH = 50;

/**
 * A regular expression to match heading tags.
 * @type {RegExp}
 */
const HEADING_TAGS_REGEX = /^h[1-6]$/;

/**
 * Filters out all nodes that are center-aligned and longer than 50 characters (as defined in `MAX_CENTER_ALIGNED_LENGTH`).
 * @param {Node[]} nodes An array of nodes.
 * @param {string[]} centerClasses The classes that are used to identify center-aligned elements.
 * @returns {Node[]} An array containing all center-aligned nodes that are longer than 50 characters.
 */
function getLongCenterAlignedElements( nodes, centerClasses ) {
	return nodes.filter( node => {
		if ( ! node.attributes.class ) {
			return false;
		}

		// We convert node.attributes.class to an array so we can use the `intersection` function from lodash.
		// When the `intersection` function on Set becomes more widely available, we can remove this conversion.
		return intersection( [ ...node.attributes.class ], centerClasses ).length > 0 &&
			node.innerText().length > MAX_CENTER_ALIGNED_LENGTH;
	} );
}

/**
 * Finds all paragraphs and headings that are center-aligned and longer than 50 characters (after stripping HTML tags).
 * @param {Paper} paper The paper to analyze.
 * @param {Researcher} researcher The researcher.
 * @returns {Node[]} An array of nodes containing too long center-aligned paragraphs/headings.
 */
export default function( paper, researcher ) {
	const tree = paper.getTree();

	const paragraphs = tree.findAll( node => node.name === "p" );
	const headings = tree.findAll( node => HEADING_TAGS_REGEX.test( node.name ) );

	const centerClasses = researcher.getConfig( "centerClasses" );

	return getLongCenterAlignedElements( paragraphs.concat( headings ), centerClasses );
}
