import { maxBy } from "lodash";

/**
 * @type {import("../index").Score} Score
 * @type {import("../index").ScoreType} ScoreType
 */

/**
 * @param {Score[]} scores The SEO scores.
 * @param {Object.<ScoreType,string>} descriptions The descriptions.
 * @returns {JSX.Element} The element.
 */
export const ContentStatusDescription = ( { scores, descriptions } ) => {
	const maxScore = maxBy( scores, "amount" );

	return <p>{ descriptions[ maxScore?.name ] || "" }</p>;
};
