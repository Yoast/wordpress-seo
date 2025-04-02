/**
 * Factory functions for creating lists of assessments for cornerstone content.
 *
 * To be used in creating the different kinds of assessors.
 */
/**
 * Creates a new list of SEO assessments.
 *
 * @returns {module:parsedPaper/assess.Assessment[]} The list of SEO assessments.
 *
 * @private
 * @memberOf module:parsedPaper/assess
 */
export function constructSEOAssessments(): any;
/**
 * Creates a new list of readability assessments.
 *
 * @returns {module:parsedPaper/assess.Assessment[]} The list of readability assessments.
 *
 * @private
 * @memberOf module:parsedPaper/assess
 */
export function constructReadabilityAssessments(): any;
/**
 * Creates a new list of SEO assessments for related keyphrases.
 *
 * @returns {module:parsedPaper/assess.Assessment[]} The list of SEO assessments.
 *
 * @private
 * @memberOf module:parsedPaper/assess
 */
export function constructRelatedKeyphraseAssessments(): any;
