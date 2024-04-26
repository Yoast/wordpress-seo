import doubleQuotes from "../sanitize/doubleQuotes";
import { includes } from "lodash";

/**
 * Checks if the keyphrase is double-quoted.
 * @param {string} keyphrase The keyphrase to check.
 * @returns {boolean} Whether the keyphrase is double-quoted.
 */
const isDoubleQuoted = ( keyphrase ) => {
	return ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) );
};

export default isDoubleQuoted;
