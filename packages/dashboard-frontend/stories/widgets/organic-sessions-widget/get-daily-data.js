import { getRandomArray } from "./get-random";

/**
 * @typedef {Object} OrganicSessionsDailyData The raw organic sessions daily data.
 * @property {string} date The date.
 * @property {number} sessions The number of sessions.
 */

/**
 * @param {number[]} [sessions] The sessions to supply a date to.
 * @param {Date} [endDate] The last date.
 * @returns {OrganicSessionsDailyData[]} The daily data.
 */
export const getDailyData = ( sessions = getRandomArray(), endDate = new Date() ) => {
	return sessions.map( ( currentSessions, index ) => {
		// The current date is the last data point.
		const date = new Date( endDate.getTime() - ( ( sessions.length - 1 - index ) * 86400000 ) );
		return {
			// Format the date to YYYYMMDD.
			date: `${ date.getFullYear() }${ String( date.getMonth() + 1 ).padStart( 2, "0" ) }${ String( date.getDate() ).padStart( 2, "0" ) }`,
			sessions: currentSessions,
		};
	} );
};
