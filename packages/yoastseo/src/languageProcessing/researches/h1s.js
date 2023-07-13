/**
 * Gets all H1s in a text, including their content and their position information.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {Array} An array with all H1s, their content and position.
 */
export default function( paper ) {
	const tree = paper.getTree();

	const h1Matches = tree.findAll( node => node.name === "h1" );


	const h1s = [];

	h1Matches.forEach( h1Match => {
		h1s.push( {
			tag: "h1",
			content: h1Match.findAll( node => node.name === "#text" ).map( textNode => textNode.value ).join( "" ),
			position: { startOffset: h1Match.sourceCodeLocation.startTag.endOffset, endOffset: h1Match.sourceCodeLocation.endTag.startOffset },
		} );
	} );

	return h1s;
}
