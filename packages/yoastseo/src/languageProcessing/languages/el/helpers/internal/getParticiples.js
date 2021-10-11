import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

const passiveParticipleEndings = "(ούμενους|ημένους|ούμενος|ούμενου|ούμενον|ούμενης|ούμενοι|ούμενων|ούμενες|μένους|" +
	"ημένος|ημένου|ημένον|ημένοι|ημένων|ημένης|ημένες|ούμενη|ούμενο|ούμενα|μένος|μένου|μένον|μένοι|μένης|μένες|" +
	"μένων|ημένη|ημένο|ημένα|μένη|μένο|μένα)$";

/**
 * Creates an array of participles found in a clause.
 *
 * @param {string} clauseText   The clause to finds participles in.
 *
 * @returns {Array} The array with the participles found.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );

	return words.filter( word => new RegExp( passiveParticipleEndings ).test( word ) );
}
