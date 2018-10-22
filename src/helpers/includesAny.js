import { includes } from "lodash-es";

/**
 * Checks if any of the values is in the collection.
 *
 * @param {Object|array} collection The collection to check in.
 * @param {array}        values     The array of values.
 *
 * @returns {boolean} Whether a value was found in the collection.
 */
export default function includesAny( collection, values ) {
	for( let i = 0; i < values.length; i++ ) {
		if ( includes( collection, values[ i ] ) ) {
			return true;
		}
	}

	return false;
}
