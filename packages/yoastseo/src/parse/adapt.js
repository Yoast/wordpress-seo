const phrasingContent = [
	"b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea", "#text",
];

/**
 * Checks whether a node only consists of whitespace.
 *
 * @param {Object} node The node to check.
 *
 * @returns {boolean} Whether a node only consists of whitespace.
 */
function onlyConsistsOfWhitespace( node ) {
	return node.value && node.value.match( /^[\n\s]+$/g );
}

/**
 * Combines runs of phrasing content ("inline" tags like `a` and `span` and text) into implicit paragraphs.
 *
 * @see https://html.spec.whatwg.org/#paragraphs
 *
 * @param {Array} nodes The nodes to combine where able to.
 *
 * @returns {Array} The combined nodes.
 */
function combineImplicitParagraphs( nodes ) {
	const newNodes = [];
	let implicitParagraph = {
		nodeName: "p",
		isImplicit: true,
		attrs: [],
		childNodes: [],
	};

	nodes.forEach( node => {
		if (
			phrasingContent.includes( node.nodeName ) &&
			! onlyConsistsOfWhitespace( node )
		) {
			implicitParagraph.childNodes.push( node );
		} else {
			if ( implicitParagraph && implicitParagraph.childNodes.length > 0 ) {
				newNodes.push( implicitParagraph );
				implicitParagraph = {
					nodeName: "p",
					isImplicit: true,
					attrs: [],
					childNodes: [],
				};
			}
			newNodes.push( node );
		}
	} );

	if ( implicitParagraph && implicitParagraph.childNodes.length > 0 ) {
		newNodes.push( implicitParagraph );
	}

	return newNodes;
}

/**
 * Adapts the `parse5` tree to our own tree representation.
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
		children = combineImplicitParagraphs( children );
	}

	return {
		nodeName: tree.nodeName,
		attrs: tree.attrs,
		childNodes: children,
	};
}
