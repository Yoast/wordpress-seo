/**
 * All HTML element tags that we treat as formatting.
 * @type {string[]}
 */
const formattingElements = [ "strong", "emph" ];

/**
 * All tags of the HTML element types that are irrelevant for our analysis.
 * @type {string[]}
 */
const irrelevantHtmlElements = [ "script", "style", "pre" ];

/**
 * All HTML heading element tags, from `h1` to `h6`.
 * @type {string[]}
 */
const headings = [ "h1", "h2", "h3", "h4", "h5", "h6" ];

export {
	formattingElements,
	irrelevantHtmlElements,
	headings,
};
