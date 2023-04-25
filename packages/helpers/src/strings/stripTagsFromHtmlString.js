const NEVER_ALLOWED_TAGS = [ "script", "style" ];
const ALLOWED_HREF_PROTOCOLS = [ ":", "https:", "http:" ];
const DEFAULT_ALLOWED_ATTRIBUTES = {
	a: [ "href", "target", "rel" ],
};

/**
 * Strips attributes from an HTML node.
 *
 * @param {ChildNode} node The node.
 * @param {string[]} allowedAttributes The allowed attributes.
 *
 * @returns {void}
 */
const stripHtmlAttributesFromNode = ( node, allowedAttributes ) => {
	const attributes = node.getAttributeNames();
	attributes.forEach( attribute => {
		if ( allowedAttributes.includes( attribute ) ) {
			if ( attribute === "href" && node.nodeName.toLowerCase() === "a" ) {
				if ( ! ALLOWED_HREF_PROTOCOLS.includes( node.protocol ) ) {
					node.removeAttribute( attribute );
				}
			}
			return;
		}
		node.removeAttribute( attribute );
	} );
};

/**
 * Strips tags from HTML nodes.
 *
 * @param {NodeListOf<ChildNode>} nodes The nodes.
 * @param {string[]} allowedTags The allowed tags.
 * @param {Object} allowedAttributes The allowed attributes, keyed per tag.
 *
 * @returns {void}
 */
const stripHtmlTagsFromNodes = ( nodes, allowedTags, allowedAttributes ) => {
	// Keep a list, otherwise the loop can go wrong when a node gets replaced.
	const replaceList = [];

	nodes.forEach( node => {
		if ( node.nodeType !== Node.ELEMENT_NODE ) {
			return;
		}

		const tag = node.nodeName.toLowerCase();
		if ( NEVER_ALLOWED_TAGS.includes( tag ) ) {
			node.remove();
			return;
		}

		stripHtmlTagsFromNodes( node.childNodes, allowedTags, allowedAttributes );
		if ( allowedTags.includes( tag ) ) {
			stripHtmlAttributesFromNode( node, allowedAttributes[ tag ] || DEFAULT_ALLOWED_ATTRIBUTES[ tag ] || [] );
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
 * @param {string[]} [allowedTags] The allowed tags.
 * @param {Object} [allowedAttributes] The allowed attributes, keyed per tag.
 *
 * @returns {string} The stripped HTML.
 */
export const stripTagsFromHtmlString = ( html, allowedTags = [], allowedAttributes = {} ) => {
	const parser = new DOMParser();
	const document = parser.parseFromString( html, "text/html" );

	stripHtmlTagsFromNodes( document.body.childNodes, allowedTags, allowedAttributes );

	return document.body.innerHTML;
};
