import { forEach, includes } from "lodash";
import { languageProcessing } from "yoastseo";
const { getWords, matchRegularParticiples } = languageProcessing;

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
 * Creates an array of the participles found in a clause.
 *
 * @param {string} clauseText The clause to find participles in.

 * @returns {Array} The list with participles.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		const regularParticiplesRegex = [ /\S+(é|ée|és|ées)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ];
		if ( matchRegularParticiples( word, regularParticiplesRegex ).length !== 0 || matchIrregularParticiples( word ).length !== 0 ) {
			foundParticiples.push( word );
		}
	} );
	return foundParticiples;
}
