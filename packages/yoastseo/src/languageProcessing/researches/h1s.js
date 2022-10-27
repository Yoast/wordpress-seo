import findAllInTree from "../../parse/findAllTree";


/**
 * Gets all H1s in a text, including their content and their position with regards to other HTML blocks.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {Array} An array with all H1s, their content and position.
 */
export default function( paper ) {
	// const text = paper.getText();
	// const tree = paper.getTree();


	const h1Matches = findAllInTree(
		paper.getTree(),
		node => node.nodeName === "h1"
	);


	// let blocks = getBlocks( text );
	// blocks = reject( blocks, emptyBlock );

	const h1s = [];
	h1Matches.forEach( h1Match => {
		h1s.push( {
			tag: "h1",
			content: findAllInTree( h1Match, node => node.nodeName === "#text" ).map( textNode => textNode.value ).join( "" ),
		} );
	} );

	//  );
	return h1s;
}
