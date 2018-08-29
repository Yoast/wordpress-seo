/* External dependencies */
import { __, _n, sprintf } from "@wordpress/i18n";

/**
 * Tries to parse a string to an int and returns a default if it does not produce a valid number.
 *
 * @param {string} str          String to parse to an int.
 * @param {number} [defaultInt] Default value if the parse does not return a valid number.
 *
 * @returns {number} The parsed number or default.
 */
function parseIntDefault( str, defaultInt = 0 ) {
	return parseInt( str, 10 ) || defaultInt;
}

/**
 * Transforms the durations into pluralized strings.
 *
 * @param {Object} durations         The duration values.
 * @param {number} durations.days    Number of days.
 * @param {number} durations.hours   Number of hours.
 * @param {number} durations.minutes Number of minutes.
 *
 * @returns {Array<string>} Array of pluralized durations.
 */
function getPluralizedDurations( { days, hours, minutes } ) {
	const plurals = [];
	if ( days !== 0 ) {
		plurals.push( sprintf( _n( "%d day", "%d days", 7, "wordpress-seo" ), days ) );
	}
	if ( hours !== 0 ) {
		plurals.push( sprintf( _n( "%d hour", "%d hours", hours, "wordpress-seo" ), hours ) );
	}
	if ( minutes !== 0 ) {
		plurals.push( sprintf( _n( "%d minute", "%d minutes", minutes, "wordpress-seo" ), minutes ) );
	}
	return plurals;
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
	const elements = getPluralizedDurations( {
		days: parseIntDefault( durations.days ),
		hours: parseIntDefault( durations.hours ),
		minutes: parseIntDefault( durations.minutes ),
	} );

	if ( elements.length === 1 ) {
		return elements[ 0 ];
	}
	if ( elements.length === 2 ) {
		return sprintf(
			/* Translators: %s expands to unit of time (e.g. 1 day or 2 hours) */
			__( "%s and %s", "wordpress-seo" ),
			...elements,
		);
	}
	if ( elements.length === 3 ) {
		return sprintf(
			/* Translators: %s expands to unit of time (e.g. 1 day or 2 hours) */
			__( "%s, %s and %s", "wordpress-seo" ),
			...elements,
		);
	}
	return "";
}
