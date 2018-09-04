import { stripFullTags as stripHTMLTags } from "./stripHTMLTags";
import stripSpaces from "./stripSpaces";
import transliterate from "./transliterate";
import replaceDiacritics from "./replaceDiacritics";
import imageInText from "./imageInText";
import relevantWords from "./relevantWords";
import removeHtmlBlocks from "./htmlParser";
import createWordRegex from "./createWordRegex";
import wordBoundaries from "../config/wordBoundaries";

export {
	stripHTMLTags,
	stripSpaces,
	transliterate,
	replaceDiacritics,
	imageInText,
	relevantWords,
	removeHtmlBlocks,
	wordBoundaries,

	// We don't want to expose this, but yoast-components needs it.
	createWordRegex as __createWordRegex,
};
