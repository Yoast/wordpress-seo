const stripHTMLTags = require( "./stripHTMLTags" ).stripFullTags;
const stripSpaces = require( "./stripSpaces" );
const transliterate = require( "./transliterate" );
const replaceDiacritics = require( "./replaceDiacritics" );
const imageInText = require( "./imageInText" );
const relevantWords = require( "./relevantWords" );
const removeHtmlBlocks = require( "./htmlParser" );
const createWordRegex = require( "./createWordRegex" );
const wordBoundaries = require( "../config/wordBoundaries" );

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
