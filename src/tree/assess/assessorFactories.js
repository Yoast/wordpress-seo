/* Assessment list factories. */
import {
	constructReadabilityAssessments,
	constructSEOAssessments,
	constructTaxonomyAssessments,
} from "./assessmentListFactories";

/* Score aggregators */
import { ReadabilityScoreAggregator, SEOScoreAggregator } from "./scoreAggregators";

/* Base TreeAssessor class */
import TreeAssessor from "./TreeAssessor";

/**
 * Creates a new assessor for assessing the Search Engine Optimization (SEO) of a text.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The SEO assessor.
 */
export function constructSEOAssessor( i18n, researcher ) {
	const assessments = constructSEOAssessments();
	const scoreAggregator = new SEOScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
}

/**
 * Creates a new assessor for assessing the readability of a text.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The readability assessor.
 */
export function constructReadabilityAssessor( i18n, researcher ) {
	const assessments = constructReadabilityAssessments();
	const scoreAggregator = new ReadabilityScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
}

/**
 * Creates a new assessor for assessing the SEO of a text on a taxonomy page.
 *
 * @param {Jed}                                 i18n       The Jed object to use for localization / internalization.
 * @param {module:tree/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @returns {module:tree/assess.TreeAssessor} The SEO taxonomy assessor.
 */
export function constructTaxonomyAssessor( i18n, researcher ) {
	const assessments = constructTaxonomyAssessments();
	const scoreAggregator = new SEOScoreAggregator();
	return new TreeAssessor( { i18n, researcher, assessments, scoreAggregator } );
}
