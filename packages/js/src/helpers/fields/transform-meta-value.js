/* eslint-disable complexity */

/**
 * Prepare value to be saved in hidden field.
 *
 * @param {string} key The key of the value.
 * @param {string} value The value to be saved.
 *
 * @returns {string} The value to be saved.
 */
export const transformMetaValue = ( key, value ) => {
	switch ( true ) {
		case key === "content_score":
		case key === "linkdex":
		case key === "inclusive_language_score":
		case key === "estimated-reading-time-minutes":
			if ( value && value >= 0 ) {
				return String( value );
			}
			return "0";
		case key.startsWith( "primary_" ):
		case key === "open_graph-image-id":
		case key === "twitter-image-id":
			if ( value > 0 ) {
				return String( value );
			}
			return "";
		case key === "is_cornerstone":
		case key === "wordproof_timestamp":
			return value ? "1" : "0";
		case key === "meta-robots-adv":
			return Array.isArray( value ) ? value.join() : value;
		default:
			return value;
	}
};
