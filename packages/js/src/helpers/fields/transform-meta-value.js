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
	const integerKeys = [
		"open_graph-image-id",
		"twitter-image-id",
		"content_score",
		"linkdex",
		"inclusive_language_score",
		"estimated-reading-time-minutes",
	];
	const booleanKeys = [ "is_cornerstone", "wordproof_timestamp" ];

	const arrayKeys = [
		"meta-robots-adv",
	];

	switch ( true ) {
		case integerKeys.includes( key ):
		case key.startsWith( "primary_" ):
			if ( value && value >= 0 ) {
				return String( value );
			}
			return "0";
		case booleanKeys.includes( key ):
			return value ? "1" : "0";
		case arrayKeys.includes( key ):
			return Array.isArray( value ) ? value.join() : value;
		default:
			return value;
	}
};
