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
 * @returns {Node[]} An array containing all center-aligned nodes that are longer than 50 characters.
 */
function getLongCenterAlignedElements( nodes ) {
	return nodes.filter( node => {
		const isCenterAligned = node.attributes.class instanceof Set && node.attributes.class.has( "has-text-align-center" );
		return isCenterAligned && node.innerText().length > MAX_CENTER_ALIGNED_LENGTH;
	} );
}

/**
 * Finds all paragraphs and headings that are center-aligned and longer than 50 characters (after stripping HTML tags).
 * @param {Paper} paper The paper to analyze.
 * @returns {Node[]} An array of nodes containing too long center-aligned paragraphs/headings.
 */
export default function( paper ) {
	const tree = paper.getTree();

	const paragraphs = tree.findAll( node => node.name === "p" );
	const headings = tree.findAll( node => HEADING_TAGS_REGEX.test( node.name ) );

	return getLongCenterAlignedElements( paragraphs.concat( headings ) );
}
