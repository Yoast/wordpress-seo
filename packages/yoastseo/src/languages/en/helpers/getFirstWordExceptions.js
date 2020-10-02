export firstWordExceptions from "../config/passiveVoice/firstWordExceptions.js";

/**
 * Returns the first word exceptions function for a locale.
 *
 * @returns {Function} A function that will return the first word exceptions.
 */
export default function() {
	return firstWordExceptions;
}
