import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

/**
 * Creates an array of participles found in a clause.
 *
 * @param {string} clauseText   The clause to finds participles in.
 *
 * @returns {Object|Array} The array with the participles.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );
	const participleEndings = "(ούμενους|ημένους|ούμενος|ούμενου|ούμενον|ούμενης|ούμενοι|ούμενων|ούμενες|μένους|" +
		"ημένος|ημένου|ημένον|ημένοι|ημένων|ημένης|ημένες|ούμενη|ούμενο|ούμενα|μένος|μένου|μένον|μένοι|μένης|μένες|" +
		"μένων|ημένη|ημένο|ημένα|μένη|μένο|μένα)$";
	const participleEndingsRegex = new RegExp( participleEndings );
	const infinitiveEndingsRegex = new RegExp( "(ηθεί|φθεί|θει|τει)$" );
	const participle = words.filter( word => participleEndingsRegex.test( word ) );
	const infinitive = words.filter( word => infinitiveEndingsRegex.test( word ) );
	if ( participle.length > 0 ) {
		return { participle: participle, type: "participle" };
	} else if ( infinitive.length > 0 ) {
		return { participle: infinitive, type: "infinitive" };
	}
	return null;
}
