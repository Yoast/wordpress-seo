/**
 * All HTML element tags that we treat as formatting / phrasing content.
 * @type {string[]}
 * @const
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
 *
 * @memberOf module:tree/builder
 */
const formattingElements = [ "a", "abbr", "audio", "b", "bdo", "br", "button", "canvas", "cite", "code", "command",
	"data", "datalist", "dfn", "del", "em", "embed", "i", "iframe", "img", "input", "kbd", "keygen", "label", "mark",
	"math", "meter", "noscript", "object", "output", "progress", "q", "ruby", "samp", "script", "select", "small",
	"span", "strong", "sub", "sup", "svg", "textarea", "time", "var", "video", "wbr" ];

/**
 * All tags of the HTML element types that are irrelevant for our analysis.
 * @type {string[]}
 * @const
 *
 * @memberOf module:tree/builder
 */
const irrelevantHtmlElements = [ "script", "style", "pre" ];

/**
 * All HTML heading element tags, from `h1` to `h6`.
 * @type {string[]}
 * @const
 *
 * @memberOf module:tree/builder
 */
const headings = [ "h1", "h2", "h3", "h4", "h5", "h6" ];

export {
	formattingElements,
	irrelevantHtmlElements,
	headings,
};
