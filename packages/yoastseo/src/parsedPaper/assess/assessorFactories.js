/* Assessment list factories. */
import {
	constructReadabilityAssessments,
	constructRelatedKeyphraseAssessments,
	constructRelatedKeyphraseTaxonomyAssessments,
	constructSEOAssessments,
	constructTaxonomyAssessments,
} from "./assessmentListFactories";

import {
	constructSEOAssessments as constructCornerstoneSEOAssessments,
	constructRelatedKeyphraseAssessments as constructCornerstoneRelatedKeyphraseAssessments,
	constructReadabilityAssessments as constructCornerstoneReadabilityAssessments,
} from "./cornerstone/assessmentListFactories";

/* Score aggregators */
import { ReadabilityScoreAggregator, SEOScoreAggregator } from "./scoreAggregators";

/* Base TreeAssessor class */
import TreeAssessor from "./TreeAssessor";

/**
 * Maps combinations of assessor parameters (if the assessor is for related keyphrases, cornerstone content and/or taxonomy pages)
 * to functions that generate a list of applicable assessments.
 *
 * @const
 * @private
 * @type {Object}
 */
const SEO_ASSESSMENTS_MAP = {
	Default: constructSEOAssessments,

	RelatedKeyphrase: constructRelatedKeyphraseAssessments,
	Taxonomy: constructTaxonomyAssessments,
	RelatedKeyphraseTaxonomy: constructRelatedKeyphraseTaxonomyAssessments,

	Cornerstone: constructCornerstoneSEOAssessments,
	CornerstoneRelatedKeyphrase: constructCornerstoneRelatedKeyphraseAssessments,
};

/**
 * Constructs a new SEO assessor.
 *
 * @param {module:parsedPaper/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @param {Object}                              config                    The assessor configuration.
 * @param {boolean}                             [config.relatedKeyphrase] If this assessor is for a related keyphrase, instead of the main one.
 * @param {boolean}                             [config.taxonomy]         If this assessor is for a taxonomy page, instead of a regular page.
 * @param {boolean}                             [config.cornerstone]      If this assessor is for cornerstone content.
 *
 * @returns {module:parsedPaper/assess.TreeAssessor} The created SEO assessor.
 *
 * @throws {Error} An error when no assessor exists for the given combination of configuration options.
 *
 * @memberOf module:parsedPaper/assess
 */
const constructSEOAssessor = function( researcher, config ) {
	/*
	 * Construct the key to retrieve the right assessment list factory.
	 * E.g. "RelatedKeyphraseTaxonomy" for related keyphrase + taxonomy;
	 */
	const cornerstone = config.cornerstone ? "Cornerstone" : "";
	const relatedKeyphrase = config.relatedKeyphrase ? "RelatedKeyphrase" : "";
	const taxonomy = config.taxonomy ? "Taxonomy" : "";

	// (Empty key defaults to "Default" key)
	const key = [ cornerstone, relatedKeyphrase, taxonomy ].join( "" ) || "Default";

	// Retrieve the assessment list factory.
	const assessmentFactory = SEO_ASSESSMENTS_MAP[ key ];

	// This specific combination of cornerstone, taxonomy and related keyphrase does not exist.
	if ( ! assessmentFactory ) {
		throw new Error( "Cannot make an assessor based on the provided combination of configuration options" );
	}

	// Construct assessor.
	const assessments = assessmentFactory();
	const scoreAggregator = new SEOScoreAggregator();
	return new TreeAssessor( { researcher, assessments, scoreAggregator } );
};

/**
 * Constructs a new readability assessor.
 *
 * @param {module:parsedPaper/research.TreeResearcher} researcher           The researcher the assessments need to use to
 *                                                                          get information about the text.
 * @param {boolean}                                    isCornerstoneContent If the to be analyzed content is considered cornerstone content
 * (which uses stricter boundaries).
 *
 * @returns {module:parsedPaper/assess.TreeAssessor} The created readability assessor.
 *
 * @memberOf module:parsedPaper/assess
 */
const constructReadabilityAssessor = function( researcher, isCornerstoneContent = false ) {
	const assessments = isCornerstoneContent ? constructReadabilityAssessments() : constructCornerstoneReadabilityAssessments();
	const scoreAggregator = new ReadabilityScoreAggregator();
	return new TreeAssessor( { researcher, assessments, scoreAggregator } );
};

export {
	constructSEOAssessor,
	constructReadabilityAssessor,
};
