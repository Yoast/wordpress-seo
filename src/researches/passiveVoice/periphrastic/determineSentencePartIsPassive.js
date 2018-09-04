import { forEach } from "lodash-es";

/**
 * Checks if the participles make the sentence part passive.
 *
 * @param {Array} participles A list of participles.
 * @returns {boolean} Returns true if the sentence part is passive.
 */
export default function( participles ) {
	let passive = false;
	forEach( participles, function( participle ) {
		if ( participle.determinesSentencePartIsPassive() ) {
			passive = true;
			return;
		}
	} );
	return passive;
};
