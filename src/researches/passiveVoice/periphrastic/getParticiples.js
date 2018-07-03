const getWords = require( "../../../stringProcessing/getWords.js" );

const matchParticiples = require( ".//matchParticiples" )();
const regularParticipleRegex = matchParticiples.regularParticiples;
const irregularParticipleRegex = matchParticiples.irregularParticiples;

const EnglishParticiple = require( "../../english/passiveVoice/EnglishParticiple.js" );
const FrenchParticiple = require( "../../french/passiveVoice/FrenchParticiple.js" );
const SpanishParticiple = require( "../../spanish/passiveVoice/SpanishParticiple.js" );
const ItalianParticiple = require( "../../italian/passiveVoice/ItalianParticiple.js" );
const DutchParticiple = require( "../../dutch/passiveVoice/DutchParticiple.js" );

let forEach = require( "lodash/forEach" );

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} language The language to find the participles for.
 * @returns {Array} The list with participle objects.
 */
module.exports = function( sentencePartText, auxiliaries, language ) {
	let words = getWords( sentencePartText );
	let foundParticiples = [];

	forEach( words, function( word ) {
		let type = "";
		if( regularParticipleRegex( word, language ).length !== 0 ) {
			type = "regular";
		}
		if( irregularParticipleRegex( word, language ).length !== 0 ) {
			type = "irregular";
		}
		if ( type !== "" ) {
			switch ( language ) {
				case "fr":
					foundParticiples.push( new FrenchParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "es":
					foundParticiples.push( new SpanishParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "it":
					foundParticiples.push( new ItalianParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "nl":
					foundParticiples.push( new DutchParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
				case "en":
				default:
					foundParticiples.push( new EnglishParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
			}
		}
	} );
	return foundParticiples;
};
