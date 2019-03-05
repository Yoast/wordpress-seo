/* Assessment list factories. */
import {
	constructReadabilityAssessments,
	constructRelatedKeyphraseAssessments,
	constructRelatedKeyphraseTaxonomyAssessments,
	constructSEOAssessments,
	constructTaxonomyAssessments,
} from "./assessmentListFactories";

/* Score aggregators */
import { ReadabilityScoreAggregator, SEOScoreAggregator } from "./scoreAggregators";

/* Base TreeAssessor class */
import TreeAssessor from "./TreeAssessor";

/**
 * Factory functions for constructing different kinds of assessors.
 *
 * @module tree/assess/assessorFactories
 */

/**
 * Creates a new assessor for assessing the Search Engine Optimization (SEO) of a text.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The SEO assessor.
 *
 * @memberOf module:tree/assess/assessorFactories
 */
const constructSEOAssessor = function( i18n, researcher ) {
	const assessments = constructSEOAssessments();
	const scoreAggregator = new SEOScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
};

/**
 * Creates a new assessor for assessing the readability of a text.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The readability assessor.
 *
 * @memberOf module:tree/assess/assessorFactories
 */
const constructReadabilityAssessor = function( i18n, researcher ) {
	const assessments = constructReadabilityAssessments();
	const scoreAggregator = new ReadabilityScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
};

/**
 * Creates a new assessor for assessing the SEO of a text on a taxonomy page.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The SEO taxonomy assessor.
 *
 * @memberOf module:tree/assess/assessorFactories
 */
const constructTaxonomyAssessor = function( i18n, researcher ) {
	const assessments = constructTaxonomyAssessments();
	const scoreAggregator = new SEOScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
};

/**
 * Creates a new assessor for assessing the SEO of a text in relation to a related keyphrase.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The SEO assessor.
 *
 * @memberOf module:tree/assess/assessorFactories
 */
const constructRelatedKeyphraseAssessor = function( i18n, researcher ) {
	const assessments = constructRelatedKeyphraseAssessments();
	const scoreAggregator = new SEOScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
};

/**
 * Creates a new assessor for assessing the SEO of a text on a taxonomy page in relation to a related keyphrase.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The SEO assessor.
 *
 * @memberOf module:tree/assess/assessorFactories
 */
const constructRelatedKeyphraseTaxonomyAssessor = function( i18n, researcher ) {
	const assessments = constructRelatedKeyphraseTaxonomyAssessments();
	const scoreAggregator = new SEOScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
};

export {
	// Readability assessor.
	constructReadabilityAssessor,
	// SEO assessors (main keyphrase).
	constructSEOAssessor,
	constructTaxonomyAssessor,
	// SEO assessors (related keyphrase).
	constructRelatedKeyphraseAssessor,
	constructRelatedKeyphraseTaxonomyAssessor,
};
