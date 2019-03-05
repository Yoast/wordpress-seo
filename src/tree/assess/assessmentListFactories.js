/**
 * Factory functions for creating lists of assessments.
 *
 * To be used in creating the different kinds of assessors.
 *
 * @see module:tree/assess/assessorFactories
 *
 * @module tree/assess/assessmentListFactories
 */

/**
 * Creates a new list of SEO assessments.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @memberOf module:tree/assess/assessmentListFactories
 */
const constructSEOAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of readability assessments.
 *
 * @returns {module:tree/assess.Assessment[]} The list of readability assessments.
 *
 * @memberOf module:tree/assess/assessmentListFactories
 */
const constructReadabilityAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of SEO assessments for taxonomy pages.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @memberOf module:tree/assess/assessmentListFactories
 */
const constructTaxonomyAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of SEO assessments for taxonomy pages.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @memberOf module:tree/assess/assessmentListFactories
 */
const constructRelatedKeyphraseAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of SEO assessments for taxonomy pages.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @memberOf module:tree/assess/assessmentListFactories
 */
const constructRelatedKeyphraseTaxonomyAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

export {
	constructSEOAssessments,
	constructReadabilityAssessments,
	constructTaxonomyAssessments,
	constructRelatedKeyphraseAssessments,
	constructRelatedKeyphraseTaxonomyAssessments,
};
