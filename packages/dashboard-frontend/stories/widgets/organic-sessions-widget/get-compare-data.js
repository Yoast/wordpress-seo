import { getRandom } from "./get-random";

/**
 * @typedef {"current"|"previous"} OrganicSessionsPeriod The organic sessions period.
 */

/**
 * @typedef {Object<OrganicSessionsPeriod, Object<"sessions",number>>} RawOrganicSessionsCompareData The organic sessions compare data.
 */

/**
 * @param {number} [current] The current number of sessions.
 * @param {number} [previous] The previous number of sessions.
 * @returns {[RawOrganicSessionsCompareData]} The compare data.
 */
export const getCompareData = ( current = getRandom(), previous = getRandom() ) => [
	{
		current: {
			sessions: current,
		},
		previous: {
			sessions: previous,
		},
	},
];
