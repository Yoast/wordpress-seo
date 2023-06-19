import addWordBoundary from "../word/addWordboundary";
import { replaceTurkishIsMemoized } from "../transliterate/specialCharacterMappings";
// import matchTextWithTransliteration from "../match/matchTextWithTransliteration";

/**
 * Creates a regex from the keyword with included wordboundaries.
 *
 * @param {string} keyword  The keyword to create a regex from.
 * @param {string} locale   The locale.
 *
 * @returns {RegExp} Regular expression of the keyword with word boundaries.
 */
const toRegex = function( keyword, locale ) {
	keyword = addWordBoundary( keyword, false, "", locale );
	return new RegExp( keyword, "ig" );
};

/**
 * Matches a string with and without transliteration.
 * Adapted from yoastseo/src/languageProcessing/helpers/match/matchTextWithTransliteration.js
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Boolean} All matches from the original as the transliterated text and keyword.
 */
const matchTextWithTransliteration = function( text, keyword, locale ) {
	let keywordRegex = toRegex( keyword, locale );

	if ( locale === "tr_TR" ) {
		const turkishMappings = replaceTurkishIsMemoized( keyword );
		keywordRegex = new RegExp( turkishMappings.map( x => addWordBoundary( x ) ).join( "|" ), "ig" );
	}
	const matches = text.match( keywordRegex );

	return !! matches;
};

/**
 * Checks if a token matches with different forms of a word.
 * @param {string[]} wordForms Different forms of a word to match the token against.
 * @param {Token} token The token to match.
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean|*} True if the token matches with one of the word forms.
 */
const matchTokenWithWordForms = ( wordForms, token, locale ) => {
	// First try a literal match to avoid unnecessary regexes.
	if ( wordForms.includes( token.text ) ) {
		return true;
	}
	return wordForms.some( keyword => {
		return !! matchTextWithTransliteration( token.text, keyword, locale );
	} );
};

export default matchTokenWithWordForms;
