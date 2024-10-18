/**
 * Filters out all nodes that are center-aligned and longer than 50 characters.
 * @param {Node[]} nodes An array of nodes.
 * @returns {Node[]} An array containing all center-aligned nodes that are longer than 50 characters.
 */
function getLongCenterAlignedElements( nodes ) {
	/**
	 * Before counting the characters of a text, we sanitize the text first by removing HTML tags.
	 * In the filtered array, we save the un-sanitized text.
	 * This text will be used for highlighting feature where we will match this with the html of a post.
	 */
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
	// Get all paragraphs from the text. We only retrieve the paragraphs with <p> tags.
	const paragraphs = tree.findAll( node => node.name === "p" );
	// Get all the headings from the text. Here we retrieve the headings from level 1-6.
	const headings = tree.findAll( node => /^h[1-6]$/.test( node.name ) );

	const longParagraphsWithCenterAlignedText = getLongCenterAlignedElements( paragraphs );
	const longHeadingsWithCenterAlignedText = getLongCenterAlignedElements( headings );

	return longParagraphsWithCenterAlignedText.concat( longHeadingsWithCenterAlignedText );
}
