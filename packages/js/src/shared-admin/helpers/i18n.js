/**
 * Lowercase a string in a locale, but with invalid locale safety.
 * @param {string} string The string to lowercase.
 * @param {string} locale The locale string.
 * @returns {string} The lower case string if locale is valid, the string if locale is invalid.
 */
export const safeToLocaleLower = ( string, locale ) => {
	try {
		return string.toLocaleLowerCase( locale );
	} catch ( error ) {
		console.error( error.message );
		return string;
	}
};
