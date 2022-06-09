import { get } from "lodash";

/**
 * Formats the date in a way that is expected
 * in the Google Preview and SEO analysis.
 *
 * @param {string} dateString The date in ISO 8601 format.
 * @param {string} language The language in which to format the date.
 *
 * @returns {string} The formatted date.
 */
function formatDate( dateString, language ) {
	const date = new Date( dateString );

	const month = new Intl.DateTimeFormat( language, { month: "short" } ).format( date );
	const day = new Intl.DateTimeFormat( language, { day: "numeric" } ).format( date );
	const year = new Intl.DateTimeFormat( language, { year: "numeric" } ).format( date );

	return `${ month } ${ day }, ${ year }`;
}

/**
 * Returns the date, formatted in a way that is expected
 * in the Google Preview and SEO analysis.
 *
 * @example
 * "May 28, 2022"
 *
 * @param {Object} state The current state of the SEO store.
 *
 * @returns {string} The formatted date, or an empty string if no date is available.
 */
export default function selectFormattedDate( state ) {
	const locale = get( state, "editor.locale", "" );
	const dateString = get( state, "editor.date", "" );
	const language = locale.split( "_" )[ 0 ] || "en";

	if ( ! dateString ) {
		return "";
	}

	return formatDate( dateString, language );
}
