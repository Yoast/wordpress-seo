import { get } from "lodash-es";

import { readability, seo } from "../../src/assessments";
import getAssessment from "./getAssessment";

/*
 * List of all the readability assessments along with a list of the path to a
 * configuration that should be different in the cornerstone variant.
 */
const readabilityConfig = [
	{
		assessment: new readability.SubheadingDistributionTooLongAssessment(),
		paths: [
			[ "_config", "parameters", "recommendedMaximumWordCount" ],
			[ "_config", "parameters", "slightlyTooMany" ],
			[ "_config", "parameters", "farTooMany" ],
		],
	},
	{
		assessment: new readability.SentenceLengthInTextAssessment(),
		paths: [
			[ "_config", "slightlyTooMany" ],
			[ "_config", "farTooMany" ],
		],
	},
];

/*
 * List of all the seo assessments along with a list of the path to a
 * configuration that should be different in the cornerstone variant.
 */
const seoConfig = [
	{
		assessment: new seo.MetaDescriptionLengthAssessment(),
		paths: [
			[ "_config", "scores", "tooLong" ],
			[ "_config", "scores", "tooShort" ],
		],
	},
	{
		assessment: new seo.SubheadingsKeywordAssessment(),
		paths: [
			[ "_config", "scores", "noMatches" ],
			[ "_config", "scores", "oneMatch" ],
			[ "_config", "scores", "multipleMatches" ],
		],
	},
	{
		assessment: new seo.TextImagesAssessment(),
		paths: [
			[ "_config", "scores", "noImages" ],
			[ "_config", "scores", "withAltNonKeyword" ],
			[ "_config", "scores", "withAlt" ],
			[ "_config", "scores", "noAlt" ],
		],
	},
	{
		assessment: new seo.TextLengthAssessment(),
		paths: [
			[ "_config", "recommendedMinimum" ],
			[ "_config", "slightlyBelowMinimum" ],
			[ "_config", "belowMinimum" ],
			[ "_config", "scores", "belowMinimum" ],
			[ "_config", "scores", "farBelowMinimum" ],
		],
	},
	{
		assessment: new seo.OutboundLinksAssessment(),
		paths: [
			[ "_config", "scores", "noLinks" ],
		],
	},
	{
		assessment: new seo.PageTitleWidthAssessment(),
		paths: [
			[ "_config", "scores", "widthTooShort" ],
			[ "_config", "scores", "widthTooLong" ],
		],
	},
	{
		assessment: new seo.UrlKeywordAssessment(),
		paths: [
			[ "_config", "scores", "noKeywordInUrl" ],
		],
	},
	{
		assessment: new seo.UrlLengthAssessment(),
		paths: [
			[ "_config", "scores", "tooLong" ],
		],
	},
];

/**
 * Compares the assessments paths with the passed assessor.
 *
 * @param {Assessor}   assessor   The assessor to compare with.
 * @param {Assessment} assessment The assessment.
 * @param {Array[]}    paths      Array of paths (which is an array of strings).
 *
 * @returns {boolean} True if the values of the paths are the same.
 */
function compareAssessmentPathsWithAssessor( assessor, assessment, paths ) {
	const compareToAssessment = getAssessment( assessor, assessment.identifier );
	let result = true;

	paths.forEach( path => {
		const value = get( assessment, path, null );
		const compareToValue = get( compareToAssessment, path, null );

		if ( value !== compareToValue ) {
			result = false;
		}
	} );

	return result;
}

/**
 * Compares a config with the passed assessor.
 *
 * @param {Assessor} assessor The assessor to compare with.
 * @param {Object[]} config   The assessment.
 *
 * @returns {boolean} True if the values of the paths are the same.
 */
function combineCompareAssessmentPathsWithAssessor( assessor, config ) {
	let result = true;

	config.forEach( ( { assessment, paths } ) => {
		if ( ! compareAssessmentPathsWithAssessor( assessor, assessment, paths ) ) {
			result = false;
		}
	} );

	return result;
}

/**
 * Checks if the assessor is a cornerstone assessor.
 *
 * Use the assessment configs to determine whether we have the cornerstone
 * content assessor or the not.
 *
 * @param {CornerStoneContentAssessor} assessor The content assessor to check.
 *
 * @returns {boolean} True if it is a cornerstone assessor.
 */
export function isCornerstoneContentAssessor( assessor ) {
	return ! combineCompareAssessmentPathsWithAssessor( assessor, readabilityConfig );
}

/**
 * Checks if the assessor is a cornerstone assessor.
 *
 * Use the assessment configs to determine whether we have the cornerstone
 * content assessor or the not.
 *
 * @param {CornerstoneSEOAssessor} assessor The seo assessor to check.
 *
 * @returns {boolean} True if it is a cornerstone assessor.
 */
export function isCornerstoneSeoAssessor( assessor ) {
	return ! combineCompareAssessmentPathsWithAssessor( assessor, seoConfig );
}
