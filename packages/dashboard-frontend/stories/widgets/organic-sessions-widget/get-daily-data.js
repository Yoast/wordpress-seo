import { getRandomArray } from "./get-random";

/**
 * @typedef {Object} OrganicSessionsDailyData The raw organic sessions daily data.
 * @property {string} date The date.
 * @property {number} sessions The number of sessions.
 */

/**
 * Gets (random by default) organic sessions daily data.
 * Used in the organic sessions widget stories.
 *
 * @param {number[]} [sessions] The sessions to supply a date to.
 * @param {Date} [endDate] The last date.
 *
 * @returns {OrganicSessionsDailyData[]} The daily data.
 */
export const getDailyData = ( sessions = getRandomArray(), endDate = new Date() ) => {
	return sessions.map( ( currentSessions, index ) => {
		// The current date is the last data point.
		// The magic number 86400000 is the number of milliseconds in a day, so minus 1 day for each previous (before index) session.
		const date = new Date( endDate.getTime() - ( ( sessions.length - 1 - index ) * 86400000 ) );
		return {
			// Format the date to YYYYMMDD.
			date: `${ date.getFullYear() }${ String( date.getMonth() + 1 ).padStart( 2, "0" ) }${ String( date.getDate() ).padStart( 2, "0" ) }`,
			sessions: currentSessions,
		};
	} );
};
