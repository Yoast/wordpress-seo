import { forEach, includes } from "lodash-es";
import getWords from "../../../../helpers/word/getWords";
import matchRegularParticiples from "../../../../helpers/passiveVoice/periphrastic/matchRegularParticiples";
import FrenchParticiple from "../../values/FrenchParticiple";
import {
	irregularsRegular,
	irregularsEndingInS,
	irregularsIrregular,
} from "../../config/internal/passiveVoiceIrregulars";

/**
 * Returns an array of matches of irregular participles with suffixes.
 *
 * @param {string} word The word to match on.
 * @param {Array} irregulars The list of irregulars to match.
 * @param {string} suffixes The suffixes to match the word with.
 *
 * @returns {Array} A list with matched irregular participles.
 */
const matchFrenchParticipleWithSuffix = function( word, irregulars, suffixes ) {
	const matches = [];
	forEach( irregulars, function( irregular ) {
		const irregularParticiplesRegex = new RegExp( "^" + irregular + suffixes + "?$", "ig" );
		const participleMatch = word.match( irregularParticiplesRegex );
		if ( participleMatch ) {
			matches.push( participleMatch[ 0 ] );
		}
	} );
	return matches;
};

/**
 * Matches a word for a few lists of irregular participles.
 *
 * @param {string} word The word to match.
 * @returns {Array} The matches.
 */
const matchIrregularParticiples = function( word ) {
	// Match different classes of participles with suffixes.
	let matches = [].concat( matchFrenchParticipleWithSuffix( word, irregularsRegular, "(e|s|es)" ) );
	matches = matches.concat( matchFrenchParticipleWithSuffix( word, irregularsEndingInS, "(e|es)" ) );

	// Match irregular participles that don't require adding a suffix.
	if ( includes( irregularsIrregular, word ) ) {
		matches.push( word );
	}

	return matches;
};

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The list with participle objects.
 */
export default function getParticiples( sentencePartText, auxiliaries ) {
	const words = getWords( sentencePartText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		let type = "";
		if ( matchRegularParticiples( word, [ /\S+(é|ée|és|ées)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ] ).length !== 0 ) {
			type = "regular";
		}
		if ( matchIrregularParticiples( word ).length !== 0 ) {
			type = "irregular";
		}
		if ( type !== "" ) {
			foundParticiples.push( new FrenchParticiple( word, sentencePartText,
				{ auxiliaries: auxiliaries, type: type, language: "fr" } ) );
		}
	} );
	return foundParticiples;
}
