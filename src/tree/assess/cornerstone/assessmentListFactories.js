/**
 * Factory functions for creating lists of assessments for cornerstone content.
 *
 * To be used in creating the different kinds of assessors.
 *
 * @see module:tree/assess/assessors/cornerstone
 *
 * @module tree/assess/assessors/cornerstone/assessments
 */

/**
 * Creates a new list of SEO assessments.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @memberOf module:tree/assess/assessors/cornerstone/assessments
 */
const constructSEOAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of readability assessments.
 *
 * @returns {module:tree/assess.Assessment[]} The list of readability assessments.
 *
 * @memberOf module:tree/assess/assessors/cornerstone/assessments
 */
const constructReadabilityAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of SEO assessments for taxonomy pages.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @memberOf module:tree/assess/assessors/cornerstone/assessments
 */
const constructRelatedKeyphraseAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

export {
	constructSEOAssessments,
	constructReadabilityAssessments,
	constructRelatedKeyphraseAssessments,
};
