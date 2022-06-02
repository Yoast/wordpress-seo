/**
 * Formats the date for the Google Preview and the analysis.
 *
 * @param {string} dateString The data in ISO-format.
 *
 * @returns {string} The formatted date for the analysis.
 */
export default function formatDate( dateString ) {
	const date = new Date( dateString );

	const month = new Intl.DateTimeFormat( "en", { month: "short" } ).format( new Date( date ) );
	const day = new Intl.DateTimeFormat( "en", { day: "numeric" } ).format( date );
	const year = new Intl.DateTimeFormat( "en", { year: "numeric" } ).format( date );

	return `${ month } ${ day }, ${ year }`;
}
