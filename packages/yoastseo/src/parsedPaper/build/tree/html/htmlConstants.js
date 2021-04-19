/**
 * All HTML element tags that we treat as formatting / phrasing content.
 * @type {string[]}
 * @const
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
 *
 * @memberOf module:parsedPaper/builder
 */
const formattingElements = [ "a", "abbr", "audio", "b", "bdo", "button", "canvas", "cite", "command",
	"data", "datalist", "dfn", "del", "em", "embed", "i", "iframe", "img", "input", "kbd", "keygen", "label", "mark",
	"math", "meter", "noscript", "object", "output", "progress", "q", "ruby", "samp", "select", "small",
	"span", "strong", "sub", "sup", "svg", "textarea", "time", "var", "video", "wbr" ];

/**
 * All tags of the HTML element types that are ignored in our analysis.
 * @type {string[]}
 * @const
 *
 * @memberOf module:parsedPaper/builder
 */
const ignoredHtmlElements = [ "script", "style", "pre", "#comment", "code", "br" ];

/**
 * All HTML heading element tags, from `h1` to `h6`.
 * @type {string[]}
 * @const
 *
 * @memberOf module:parsedPaper/builder
 */
const headings = [ "h1", "h2", "h3", "h4", "h5", "h6" ];

export {
	formattingElements,
	ignoredHtmlElements,
	headings,
};
