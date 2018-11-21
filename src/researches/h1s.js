// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
import { getBlocks } from "../helpers/html";

const h1Regex = /<h1.*?>(.*?)<\/h1>/;

/**
 * Gets all H1s in a text, including their content and their position with regards to other HTML blocks.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {Array} An array with all H1s, their content and position.
 */
export default function( paper ) {
	const text = paper.getText();

	const blocks = getBlocks( text );

	const h1s = [];
	blocks.forEach( ( block, index ) => {
		const match = h1Regex.exec( block );
		if ( match ) {
			h1s.push( {
				tag: "h1",
				content: match[ 1 ],
				position: index,
			} );
		}
	} );

	return h1s;
}
