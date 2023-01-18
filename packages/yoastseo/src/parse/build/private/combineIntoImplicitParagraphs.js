/**
 * Tag names of HTML elements that are considered phrasing content
 * in the HTML content model.
 *
 * @see https://html.spec.whatwg.org/#phrasing-content
 *
 * @type {string[]}
 */
const phrasingContentTags = [
	"b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea",
];

/**
 * Checks whether a node is inter-element whitespace.
 *
 * @see https://html.spec.whatwg.org/#inter-element-whitespace
 *
 * @param {Object} node The node to check.
 *
 * @returns {boolean} Whether the node is inter-element whitespace.
 */
function isInterElementWhitespace( node ) {
	return node.nodeName === "#text" && node.value && node.value.match( /^[\n\s]+$/g );
}

/**
 * Checks whether a node is considered phrasing content.
 *
 * @see https://html.spec.whatwg.org/#phrasing-content
 *
 * @param {Object} node The node to check if it is phrasing content.
 *
 * @returns {boolean} Whether the node is phrasing content.
 */
function isPhrasingContent( node ) {
	return phrasingContentTags.includes( node.nodeName ) || node.nodeName === "#text";
}

/**
 * Checks whether a node has any children.
 *
 * @param {Object} node The node to check.
 *
 * @returns {boolean} Whether the node has any children.
 */
function hasChildren( node ) {
	return node && node.childNodes.length > 0;
}

/**
 * Combines runs of phrasing content ("inline" tags like `a` and `span`, and text) into implicit paragraphs.
 *
 * @see https://html.spec.whatwg.org/#paragraphs
 *
 * @param {Array} nodes The nodes to combine where able to.
 *
 * @returns {Array} The combined nodes.
 */
function combineIntoImplicitParagraphs( nodes ) {
	const newNodes = [];
	let implicitParagraph = {
		nodeName: "p",
		isImplicit: true,
		attrs: {},
		childNodes: [],
	};

	nodes.forEach( node => {
		if ( isPhrasingContent( node ) && ! isInterElementWhitespace( node ) ) {
			implicitParagraph.childNodes.push( node );
		} else {
			if ( hasChildren( implicitParagraph ) ) {
				newNodes.push( implicitParagraph );
				implicitParagraph = {
					nodeName: "p",
					isImplicit: true,
					attrs: {},
					childNodes: [],
				};
			}
			newNodes.push( node );
		}
	} );

	if ( hasChildren( implicitParagraph ) ) {
		newNodes.push( implicitParagraph );
	}

	return newNodes;
}

export default combineIntoImplicitParagraphs;
