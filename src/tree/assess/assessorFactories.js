import { constructSEOAssessments } from "./assessmentListFactories";

/* Score aggregators */
import { SEOScoreAggregator } from "./scoreAggregators";

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
