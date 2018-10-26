/* External dependencies */
import { __, _n, sprintf } from "@wordpress/i18n";

/**
 * Tries to parse a string to an int and returns a default if it does not produce a valid number.
 *
 * @param {string} string           String to parse to an integer.
 * @param {number} [defaultInteger] Default value if the parse does not return a valid number.
 *
 * @returns {number} The parsed number or default.
 */
function parseIntDefault( string, defaultInteger = 0 ) {
	return parseInt( string, 10 ) || defaultInteger;
}

/**
 * Transforms the durations into a translated string containing the count, and either singular or plural unit.
 *
 * For example (in en-US): If durations.days is 1, it returns "1 day". If durations.days is 2, it returns "2 days".
 *
 * @param {Object} durations         The duration values.
 * @param {number} durations.days    Number of days.
 * @param {number} durations.hours   Number of hours.
 * @param {number} durations.minutes Number of minutes.
 *
 * @returns {Array} Array of pluralized durations.
 */
function transformDurationsToStrings( { days, hours, minutes } ) {
	const strings = [];
	if ( days !== 0 ) {
		strings.push( sprintf( _n( "%d day", "%d days", days, "wordpress-seo" ), days ) );
	}
	if ( hours !== 0 ) {
		strings.push( sprintf( _n( "%d hour", "%d hours", hours, "wordpress-seo" ), hours ) );
	}
	if ( minutes !== 0 ) {
		strings.push( sprintf( _n( "%d minute", "%d minutes", minutes, "wordpress-seo" ), minutes ) );
	}
	return strings;
}

/**
 * Formats the durations into a translated string.
 *
 * @param {Object} durations         The duration values.
 * @param {string} durations.days    Number of days.
 * @param {string} durations.hours   Number of hours.
 * @param {string} durations.minutes Number of minutes.
 *
 * @returns {string} Formatted duration.
 */
export default function buildDurationString( durations ) {
	const elements = transformDurationsToStrings( {
		days: parseIntDefault( durations.days ),
		hours: parseIntDefault( durations.hours ),
		minutes: parseIntDefault( durations.minutes ),
	} );

	if ( elements.length === 1 ) {
		return elements[ 0 ];
	}
	if ( elements.length === 2 ) {
		return sprintf(
			/* translators: %s expands to a unit of time (e.g. 1 day). */
			__( "%s and %s", "wordpress-seo" ),
			...elements,
		);
	}
	if ( elements.length === 3 ) {
		return sprintf(
			/* translators: %s expands to a unit of time (e.g. 1 day). */
			__( "%s, %s and %s", "wordpress-seo" ),
			...elements,
		);
	}
	return "";
}
