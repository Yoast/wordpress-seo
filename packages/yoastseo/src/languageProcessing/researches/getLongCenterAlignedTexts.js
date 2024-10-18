/**
 * Filters out all nodes that are center-aligned and longer than 50 characters.
 * @param {Node[]} nodes An array of nodes.
 * @returns {Node[]} An array containing all center-aligned nodes that are longer than 50 characters.
 */
function getLongCenterAlignedElements( nodes ) {
	return nodes.filter( node =>
		node.attributes.class instanceof Set &&
		node.attributes.class.has( "has-text-align-center" ) &&
		node.innerText().length > 50
	);
}

/**
 * Finds all paragraphs and headings that are center-aligned and longer than 50 characters (after stripping HTML tags).
 * @param {Paper} paper The paper to analyze.
 * @returns {Node[]} An array of nodes containing too long center-aligned paragraphs/headings.
 */
export default function( paper ) {
	const tree = paper.getTree();

	const paragraphs = tree.findAll( node => node.name === "p" );
	const headings = tree.findAll( node => /^h[1-6]$/.test( node.name ) );

	return getLongCenterAlignedElements( paragraphs.concat( headings ) );
}
