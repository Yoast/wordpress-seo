import { normalize } from "./sanitize/quotes.js";
import { createShortcodeTagsRegex, filterShortcodesFromHTML } from "./sanitize/filterShortcodesFromTree.js";
import processExactMatchRequest from "./match/processExactMatchRequest.js";
import removeHtmlBlocks from "./html/htmlParser.js";

export {
	normalize,
	removeHtmlBlocks,
	filterShortcodesFromHTML,
	createShortcodeTagsRegex,
	processExactMatchRequest,
};
