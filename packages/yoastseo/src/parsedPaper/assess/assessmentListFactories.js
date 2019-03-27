/**
 * Factory functions for creating lists of assessments.
 *
 * To be used in creating the different kinds of assessors.
 */

/**
 * Creates a new list of SEO assessments.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @private
 * @memberOf module:tree/assess
 */
const constructSEOAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of readability assessments.
 *
 * @returns {module:tree/assess.Assessment[]} The list of readability assessments.
 *
 * @private
 * @memberOf module:tree/assess
 */
const constructReadabilityAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of SEO assessments for taxonomy pages.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @private
 * @memberOf module:tree/assess
 */
const constructTaxonomyAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of SEO assessments for related keyphrases.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @private
 * @memberOf module:tree/assess
 */
const constructRelatedKeyphraseAssessments = () => [
	// Needs to be populated by fancy new assessments that work on the tree representation of the text.
];

/**
 * Creates a new list of SEO assessments for related keyphrases on taxonomy pages.
 *
 * @returns {module:tree/assess.Assessment[]} The list of SEO assessments.
 *
 * @private
 * @memberOf module:tree/assess
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
