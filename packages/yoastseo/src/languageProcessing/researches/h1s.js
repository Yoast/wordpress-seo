import findAllInTree from "../../parse/findAllTree";
import innerText from "../../parse/helpers/innerText";

/**
 * Gets all H1s in a text, including their content and their position with regards to other HTML blocks.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {Array} An array with all H1s, their content and position.
 */
export default function( paper ) {
	const h1Matches = findAllInTree(
		paper.getTree(),
		node => node.nodeName === "h1"
	);

	return h1Matches.map( h1 => (
		{
			tag: "h1",
			content: innerText( h1 ),
		}
	) );
}
