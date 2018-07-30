const stripHTMLTags = require( "./stripHTMLTags" ).stripFullTags;
const stripSpaces = require( "./stripSpaces" );
const transliterate = require( "./transliterate" );
const replaceDiacritics = require( "./replaceDiacritics" );
const imageInText = require( "./imageInText" );
const relevantWords = require( "./relevantWords" );

export {
	stripHTMLTags,
	stripSpaces,
	transliterate,
	replaceDiacritics,
	imageInText,
	relevantWords,
};
