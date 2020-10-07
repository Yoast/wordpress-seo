import { stripFullTags as stripHTMLTags } from "../../../researches/stringProcessing/stripHTMLTags";
import stripSpaces from "../../../researches/stringProcessing/stripSpaces";
import transliterate from "../../../researches/stringProcessing/transliterate";
import replaceDiacritics from "../../../researches/stringProcessing/replaceDiacritics";
import imageInText from "../../../researches/stringProcessing/imageInText";
import relevantWords from "./relevantWords";
import removeHtmlBlocks from "../../../researches/stringProcessing/htmlParser";
import createWordRegex from "../../../researches/stringProcessing/createWordRegex";
import wordBoundaries from "../config/wordBoundaries";
import createRegexFromArray from "../../../researches/stringProcessing/createRegexFromArray";

export {
	stripHTMLTags,
	stripSpaces,
	transliterate,
	replaceDiacritics,
	imageInText,
	relevantWords,
	removeHtmlBlocks,
	wordBoundaries,
	createRegexFromArray,

	// We don't want to expose this, but yoast-components needs it.
	createWordRegex as __createWordRegex,
};
