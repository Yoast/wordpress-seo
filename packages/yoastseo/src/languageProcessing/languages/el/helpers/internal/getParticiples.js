import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

const passiveParticipleEndings = "(ούμενους|ημένους|ούμενος|ούμενου|ούμενον|ούμενης|ούμενοι|ούμενων|ούμενες|μένους|" +
	"ημένος|ημένου|ημένον|ημένοι|ημένων|ημένης|ημένες|ούμενη|ούμενο|ούμενα|μένος|μένου|μένον|μένοι|μένης|μένες|" +
	"μένων|ημένη|ημένο|ημένα|μένη|μένο|μένα)$";
const passiveInfinitiveEndings = "(ηθεί|φθεί|θει|τει)$";

/**
 * Creates an array of participles found in a clause.
 *
 * @param {string} clauseText   The clause to finds participles in.
 *
 * @returns {Array} The array with the participles object.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );

	// Find the passive participles
	const getParticiples = words.filter( word => new RegExp( passiveParticipleEndings ).test( word ) );
	// Find the passive infinitives
	const getInfinitives = words.filter( word => new RegExp( passiveInfinitiveEndings ).test( word ) );

	const foundPassives = [];

	if ( getParticiples.length > 0 ) {
		foundPassives.push( { participle: getParticiples, type: "participle" } );
	} else if ( getInfinitives.length > 0 ) {
		foundPassives.push( { participle: getInfinitives, type: "infinitive" } );
	}

	return foundPassives;
}
