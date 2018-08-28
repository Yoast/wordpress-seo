/* External dependencies */
import { __ } from "@wordpress/i18n";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup( moment );

/**
 * Formats the durations into a string.
 *
 * @param {Object} durations         The duration values.
 * @param {string} durations.days    Number of days.
 * @param {string} durations.hours   Number of hours.
 * @param {string} durations.minutes Number of minutes.
 *
 * @returns {string} Formatted duration.
 */
export default function buildDurationString( durations ) {
	const durationDays = durations.days ? parseInt( durations.days, 10 ) : 0;
	const durationHours = durations.hours ? parseInt( durations.hours, 10 ) : 0;
	const durationMinutes = durations.minutes ? parseInt( durations.minutes, 10 ) : 0;

	const elements = [];
	if ( durationDays !== 0 ) {
		elements.push( `d [${ __( "days", "wordpress-seo" ) }]` );
	}
	if ( durationHours !== 0 ) {
		elements.push( `h [${ __( "hours", "wordpress-seo" ) }]` );
	}
	if ( durationMinutes !== 0 ) {
		elements.push( `m [${ __( "minutes", "wordpress-seo" ) }]` );
	}

	if ( elements.length === 0 ) {
		return "";
	}

	const formatString = [
		...elements,
		elements
		.splice( elements.length - 2 )
		.join( ` [${ __( "and", "wordpress-seo" ) }] ` ),
	].join( ", " );

	return moment.duration( {
		days: durationDays,
		hours: durationHours,
		minutes: durationMinutes,
	} ).format( formatString );
}


