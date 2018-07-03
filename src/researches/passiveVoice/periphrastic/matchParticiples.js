const find = require( "lodash/find" );
const forEach = require( "lodash/forEach" );
const memoize = require( "lodash/memoize" );
const includes = require( "lodash/includes" );
const flattenDeep = require( "lodash/flattenDeep" );

const irregularsEnglish = require( "../../english/passiveVoice/irregulars" )();
const irregularsRegularFrench = require( "../../french/passiveVoice/irregulars" )().irregularsRegular;
const irregularsIrregularFrench = require( "../../french/passiveVoice/irregulars" )().irregularsIrregular;
const irregularsEndingInSFrench = require( "../../french/passiveVoice/irregulars" )().irregularsEndingInS;
const spanishParticiples = require( "../../spanish/passiveVoice/participles" )();
const italianParticiples = require( "../../italian/passiveVoice/participles" )();

const nlRegex1 = /(ge|be|ont|ver|her|er)\S+(d|t)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
const nlRegex2 = /(aan|af|bij|binnen|los|mee|na|neer|om|onder|samen|terug|tegen|toe|uit|vast)(ge)\S+(d|t|n)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;

// The language-specific participle regexes.
const languageVariables = {
	en: {
		regularParticiplesRegex: /\w+ed($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
	},
	fr: {
		regularParticiplesRegex: /\S+(é|ée|és|ées)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
	},
	nl: {
		regularParticipleRegexPattern1: nlRegex1,
		regularParticipleRegexPattern2: nlRegex2,
	},
};

/**
 * Returns words that have been determined to be a regular participle.
 *
 * @param {string} word The word to check.
 * @param {string} language The language in which to match.
 *
 * @returns {Array} A list with the matches.
 */
let regularParticiples = function( word, language ) {
	// In Spanish and Italian we don't match participles with a regular regex pattern.
	if ( ( language === "es" ) || ( language === "it" ) ) {
		return [];
	}

	// Matches word with language-specific participle regexes.
	let matches = [];

	Object.keys( languageVariables[ language ] ).forEach( function( regex ) {
		const match = word.match( languageVariables[ language ][ regex ] );
		if( match !== null ) {
			matches.push( match );
		}
	} );

	matches = flattenDeep( matches );

	return matches;
};

/**
 * Returns an array of matches of irregular participles with suffixes.
 *
 * @param {string} word The word to match on.
 * @param {Array} irregulars The list of irregulars to match.
 * @param {string} suffixes The suffixes to match the word with.
 *
 * @returns {Array} A list with matched irregular participles.
 */
let matchFrenchParticipleWithSuffix = function( word, irregulars, suffixes ) {
	let matches = [];
	forEach( irregulars, function( irregular ) {
		const irregularParticiplesRegex = new RegExp( "^" + irregular + suffixes + "?$", "ig" );
		let participleMatch = word.match( irregularParticiplesRegex );
		if ( participleMatch ) {
			matches.push( participleMatch[ 0 ] );
		}
	} );
	return matches;
};

/**
 * Returns the matches for a word in the list of irregulars.
 *
 * @param {string} word The word to match in the list.
 * @param {string} language The language for which to match.
 *
 * @returns {Array} A list with the matches.
 */
let irregularParticiples = function( word, language ) {
	let matches = [];

	switch ( language ) {
		case "fr":
			// Match different classes of participles with suffixes.
			matches = matches.concat( matchFrenchParticipleWithSuffix( word, irregularsRegularFrench, "(e|s|es)" ) );
			matches = matches.concat( matchFrenchParticipleWithSuffix( word, irregularsEndingInSFrench, "(e|es)" ) );

			// Match irregular participles that don't require adding a suffix.
			find( irregularsIrregularFrench, function( irregularParticiple ) {
				if( irregularParticiple === word ) {
					matches.push( irregularParticiple );
				}
			} );
			break;
		case "es":
			// In Spanish, we only match passives from a word list.
			if ( includes( spanishParticiples, word ) ) {
				matches.push( word );
			}
			break;
		case "it":
			// In Italian, we only match passives from a word list.
			if ( includes( italianParticiples, word ) ) {
				matches.push( word );
			}
			break;
		case "en":
		default:
			find( irregularsEnglish, function( irregularParticiple ) {
				if( irregularParticiple === word ) {
					matches.push( irregularParticiple );
				}
			} );
			break;
	}
	return matches;
};

module.exports = function() {
	return {
		regularParticiples: memoize( regularParticiples ),
		irregularParticiples: memoize( irregularParticiples ),
	};
};
