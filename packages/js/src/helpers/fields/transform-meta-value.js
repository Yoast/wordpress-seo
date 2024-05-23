/* eslint-disable complexity */

/**
 * Prepare value to be saved as a string.
 *
 * @param {string} key The key of the value.
 * @param {string} value The value to be saved.
 *
 * @returns {string} The value to be saved.
 */
export const transformMetaValue = ( key, value ) => {
	switch ( key ) {
		case "content_score":
		case "linkdex":
		case "inclusive_language_score":
		case "estimated-reading-time-minutes":
			return ( value && value >= 0 ) ? String( value ) : "0";
		case "opengraph-image-id":
		case "twitter-image-id":
			return ( value && value > 0 ) ? String( value ) : "";
		case "is_cornerstone":
		case "wordproof_timestamp":
			return value ? "1" : "0";
		case "meta-robots-adv":
			return Array.isArray( value ) ? value.join() : "";
	}

	if ( key.startsWith( "primary_" ) ) {
		return ( value > 0 ) ? String( value ) : "";
	}

	return value;
};
