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
 * Checks whether a node is considered phrasing content.
 *
 * @see https://html.spec.whatwg.org/#phrasing-content
 *
 * @param {string} nodeName The name/tag of the node to check if it is phrasing content.
 *
 * @returns {boolean} Whether the node is phrasing content.
 */
function isPhrasingContent( nodeName ) {
	return phrasingContentTags.includes( nodeName ) || nodeName === "#text";
}

export default isPhrasingContent;
