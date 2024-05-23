import { isEmpty } from "lodash";

/**
 * Gathers the text content of the given node.
 *
 * @param {Object} node The node to gather the text content from.
 *
 * @returns {string} The text content.
 */
export default function innerText( node ) {
	let text = "";

	if ( ! isEmpty( node.childNodes ) ) {
		node.childNodes.forEach( child => {
			if ( child.name === "#text" ) {
				text += child.value;
			} else if ( child.name === "br" ) {
				text += "\n";
			} else {
				text += innerText( child );
			}
		} );
	}

	return text;
}
