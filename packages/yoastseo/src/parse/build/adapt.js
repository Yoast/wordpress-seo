import combineIntoImplicitParagraphs from "./combineIntoImplicitParagraphs";

/**
 * Adapts the `parse5` tree to our own tree representation.
 *
 * By adapting the external `parse5` structure to our own tree representation
 * we reduce the coupling between our code and theirs, which makes our code
 * more robust against changes in the `parse5` library. [See also this blog post about coupling](https://mrpicky.dev/six-shades-of-coupling/)
 *
 * @param {Object} tree The parse5 tree representation.
 *
 * @returns {Object} The adapted tree.
 */
export default function adapt( tree ) {
	if ( tree.nodeName === "#text" ) {
		return tree;
	}

	let children = tree.childNodes.map( adapt );
	if ( tree.nodeName !== "p" ) {
		children = combineIntoImplicitParagraphs( children );
	}

	return {
		nodeName: tree.nodeName,
		attrs: tree.attrs,
		childNodes: children,
	};
}
