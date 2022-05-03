/**
 * A function to make a list of assessments that were run from a results object.
 *
 * @param {Array} results An array of results of all assessments that were applicable.
 *
 * @returns {Array} An array with names of all assessments that appeared in the results.
 */
export default function( results ) {
	const assessments = [];

	for ( const result of results ) {
		assessments.push( result._identifier );
	}

	return assessments;
}
