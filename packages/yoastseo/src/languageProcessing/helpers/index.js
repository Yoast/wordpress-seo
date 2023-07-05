import matchStringWithRegex from "./regex/matchStringWithRegex";
import { normalize } from "./sanitize/quotes";
import removeHtmlBlocks from "./html/htmlParser";
import { stripFullTags } from "./sanitize/stripHTMLTags";

export {
	matchStringWithRegex,
	normalize,
	removeHtmlBlocks,
	stripFullTags,
};
