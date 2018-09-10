import { get } from "lodash-es";

import SubheadingDistributionTooLong from "../../src/assessments/readability/subheadingDistributionTooLongAssessment";
import SentenceLengthInText from "../../src/assessments/readability/sentenceLengthInTextAssessment";
import getAssessment from "./getAssessment";

const defaultConfigValues = {
	subheading: get ( new SubheadingDistributionTooLong(), [ "_config", "parameters", "recommendedMaximumWordCount" ], -1 ),
	sentenceLength: get ( new SentenceLengthInText(), [ "_config", "slightlyTooMany" ], -1 ),
};

/**
 * Checks if the assessor is a cornerstone assessor.
 *
 * Use the assessment configs to determine whether we have the cornerstone
 * content assessor or the not.
 *
 * @param {ContentAssessor|CornerstoneContentAssessor} assessor The assessor to check.
 *
 * @returns {boolean} True if it is a cornerstone assessor.
 */
export default function isCornerstoneAssessor( assessor ) {
	const subheadingAssessment = getAssessment( assessor, "subheadingsTooLong" );
	const subheadingConfig = get(
		subheadingAssessment,
		[ "_config", "parameters", "recommendedMaximumWordCount" ],
		defaultConfigValues.subheading
	);

	const sentenceLengthAssessment = getAssessment( assessor, "subheadingsTooLong" );
	const sentenceLengthConfig = get(
		sentenceLengthAssessment,
		[ "_config", "slightlyTooMany" ],
		defaultConfigValues.sentenceLength
	);

	return subheadingConfig !== defaultConfigValues.subheading
		&& sentenceLengthConfig !== defaultConfigValues.sentenceLength;
}
