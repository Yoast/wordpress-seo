/**
 * Gets the list of assessments for which there are results.
 *
 * @param {Array} results The assessment results.
 *
 * @returns {Array} The list of assessments for which there are results.
 */
module.exports = function( results ) {
	const assessments = [];

	for ( const result of results ) {
		assessments.push( result._identifier );
	}

	return assessments;
};
