/**
 * Searches for the assessment in the assessor.
 *
 * @param {Assessor} assessor   The assessor to query.
 * @param {string}   identifier The assessment's identifier.
 *
 * @returns {Assessment|null} The assessment or null if not found.
 */
export default function getAssessment( assessor, identifier ) {
	for ( let i = 0; i < assessor._assessments.length; i++ ) {
		if ( assessor._assessments[ i ].identifier === identifier ) {
			return assessor._assessments[ i ];
		}
	}
	return null;
}
