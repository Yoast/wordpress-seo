import { get } from "lodash";

/**
 * Formats the date in a way that is expected
 * in the Google Preview, SEO analysis and the date replacement variable.
 *
 * @param {string} dateString The date in ISO 8601 format.
 *
 * @return {string} The formatted date.
 */
function formatDate( dateString ) {
	const date = new Date( dateString );

	const month = new Intl.DateTimeFormat( "en", { month: "short" } ).format( date );
	const day = new Intl.DateTimeFormat( "en", { day: "numeric" } ).format( date );
	const year = new Intl.DateTimeFormat( "en", { year: "numeric" } ).format( date );

	return `${ month } ${ day }, ${ year }`;
}

/**
 * Returns the date, formatted in a way that is expected
 * in the Google Preview, SEO analysis and the date replacement variable.
 *
 * @example
 * "May 28, 2022"
 *
 * @param {Object} state The current state of the SEO store.
 *
 * @return {string} The formatted date, or an empty string if no date is available.
 */
export default function selectFormattedDate( state ) {
	const dateString = get( state, "editor.date" );

	if ( ! dateString ) {
		return "";
	}

	return formatDate( dateString );
}
