/**
 * Strips tags from HTML nodes.
 *
 * @param {NodeListOf<ChildNode>} nodes The nodes.
 * @param {string[]} [allowedTags] Optional. The allowed tags.
 *
 * @returns {void}
 */
const stripHtmlTagsFromNodes = ( nodes, allowedTags = [] ) => {
	// Keep a list, otherwise the loop can go wrong when a node gets replaced.
	const replaceList = [];

	nodes.forEach( node => {
		if ( node.nodeType !== Node.ELEMENT_NODE ) {
			return;
		}

		const tag = node.nodeName.toLowerCase();
		if ( tag === "script" || tag === "style" ) {
			node.remove();
			return;
		}

		stripHtmlTagsFromNodes( node.childNodes, allowedTags );
		if ( allowedTags.includes( tag ) ) {
			return;
		}

		replaceList.push( node );
	} );

	replaceList.forEach( node => node.replaceWith( ...node.childNodes ) );
};

/**
 * Strips tags from HTML.
 *
 * Note: the inner text is kept!
 * Note: always removes script and style, including inner text.
 *
 * @param {string} html The HTML.
 * @param {string[]} allowedTags Optional. The allowed tags.
 *
 * @returns {string} The stripped HTML.
 */
export const stripTagsFromHtmlString = ( html, allowedTags = [] ) => {
	const parser = new DOMParser();
	const document = parser.parseFromString( html, "text/html" );

	stripHtmlTagsFromNodes( document.body.childNodes, allowedTags );

	return document.body.innerHTML;
};
