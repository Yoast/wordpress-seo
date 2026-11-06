import { map } from "lodash";
import addWordBoundary from "../word/addWordboundary.js";
import stripSpaces from "../sanitize/stripSpaces.js";
import transliterate from "../transliterate/transliterate.js";
import transliterateWP from "../transliterate/transliterateWPstyle.js";
import { replaceTurkishIsMemoized } from "../transliterate/specialCharacterMappings";
import { getLanguage } from "../../index";

/**
 * Creates a regex from the keyword with included wordboundaries.
 *
 * Escaped periods (e.g. `\.` from version numbers like "26.04") are replaced with a pattern
 * that matches either a literal period or a space. This ensures that keyphrase words
 * containing periods can still match against slugs, where periods are converted to spaces
 * by `parseSlug`.
 *
 * @param {string} keyword  The keyword to create a regex from.
 * @param {string} language The language used to determine the word boundary.
 *
 * @returns {RegExp} Regular expression of the keyword with word boundaries.
 */
const toRegex = function( keyword, language ) {
	/*
	 * Replace escaped periods with a character class that matches either a literal period
	 * or a space. This allows keyphrase words like "26.04" to match against slugs where
	 * the period has been converted to a space (e.g. "26 04").
	 */
	const keywordWithPeriodAsWordBoundary = keyword.replace( /\\\./g, "[.\\u0020]" );

	keyword = addWordBoundary( keywordWithPeriodAsWordBoundary, false, "", language );
	return new RegExp( keyword, "ig" );
};

/**
 * Matches a string with and without transliteration.
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
export default function( text, keyword, locale ) {
	const language = getLanguage( locale );
	let keywordRegex = toRegex( keyword, language );

	if ( language === "tr" ) {
		const turkishMappings = replaceTurkishIsMemoized( keyword );
		keywordRegex = new RegExp( turkishMappings.map( x => addWordBoundary( x ) ).join( "|" ), "ig" );
	}
	const matches = text.match( keywordRegex ) || [];

	text = text.replace( keywordRegex, "" );

	const transliterateKeyword = transliterate( keyword, locale );
	const transliterateKeywordRegex = toRegex( transliterateKeyword, language );
	const transliterateMatches = text.match( transliterateKeywordRegex ) || [];
	let combinedArray = matches.concat( transliterateMatches );

	const transliterateWPKeyword = transliterateWP( keyword, locale );

	if ( ! ( transliterateWPKeyword === transliterateKeyword ) ) {
		const transliterateWPKeywordRegex = toRegex( transliterateWPKeyword, language );
		const transliterateWPMatches = text.match( transliterateWPKeywordRegex ) || [];

		combinedArray = combinedArray.concat( transliterateWPMatches );
	}

	return map( combinedArray, function( match ) {
		return stripSpaces( match );
	} );
}
