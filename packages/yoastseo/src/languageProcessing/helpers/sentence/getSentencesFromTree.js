/**
 * Gets all the sentences from paragraph and heading nodes.
 * These two node types are the nodes that should contain sentences for the analysis.
 *
 * @param {Paper} paper The paper to get the sentences from.
 *
 * @returns {Object[]} The array of sentences retrieved from paragraph and heading nodes plus sourceCodeLocation of the parent node.
 */
export default function( paper ) {
	const tree = paper.getTree().findAll( treeNode => !! treeNode.sentences );

	return tree.flatMap( node => node.sentences.map( s => ( {
		...s,
		parentStartOffset: ( node.sourceCodeLocation && node.sourceCodeLocation.startTag ) ? node.sourceCodeLocation.startTag.endOffset : 0,
	} ) )
	);
}
