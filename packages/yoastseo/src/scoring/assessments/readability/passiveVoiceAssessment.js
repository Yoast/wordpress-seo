import { map } from "lodash-es";

import formatNumber from "../../../helpers/formatNumber";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import marker from "../../../markers/addMark";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { stripIncompleteTags as stripTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";

/**
 * Calculates the result based on the number of sentences and passives.
 *
 * @param {object} passiveVoice     The object containing the number of sentences and passives.
 * @param {object} i18n             The object used for translations.
 *
 * @returns {{score: number, text}} resultobject with score and text.
 */
const calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	let score;
	let percentage = 0;
	const recommendedValue = 10;
	const urlTitle = createAnchorOpeningTag( "https://yoa.st/34t" );
	const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/34u" );

	// Prevent division by zero errors.
	if ( passiveVoice.total !== 0 ) {
		percentage = formatNumber( ( passiveVoice.passives.length / passiveVoice.total ) * 100 );
	}

	const hasMarks = percentage > 0;

	if ( percentage <= 10 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( percentage, 10, 15 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage > 15 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sPassive voice%2$s: You're using enough active voice. That's great!" ),
				urlTitle,
				"</a>"
			),
		};
	}
	return {
		score: score,
		hasMarks: hasMarks,
		text: i18n.sprintf(
			/* Translators: %1$s and %5$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
			%3$s expands to the percentage of sentences in passive voice, %4$s expands to the recommended value. */
			i18n.dgettext(
				"js-text-analysis",
				"%1$sPassive voice%2$s: %3$s of the sentences contain passive voice, which is more than the recommended maximum of %4$s. " +
				"%5$sTry to use their active counterparts%2$s."

			),
			urlTitle,
			"</a>",
			percentage + "%",
			recommendedValue + "%",
			urlCallToAction
		),
	};
};

/**
 * Marks all sentences that have the passive voice.
 *
 * @param {object} paper        The paper to use for the assessment.
 * @param {object} researcher   The researcher used for calling research.
 *
 * @returns {object} All marked sentences.
 */
const passiveVoiceMarker = function( paper, researcher ) {
	const passiveVoice = researcher.getResearch( "getPassiveVoiceResult" );
	return map( passiveVoice.passives, function( sentence ) {
		sentence = stripTags( sentence );
		const marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked,
		} );
	} );
};

/**
 * Runs the passiveVoice module, based on this returns an assessment result with score and text.
 *
 * @param {object} paper        The paper to use for the assessment.
 * @param {object} researcher   The researcher used for calling research.
 * @param {object} i18n         The object used for translations.
 *
 * @returns {object} the Assessmentresult
 */
const passiveVoiceAssessment = function( paper, researcher, i18n ) {
	const passiveVoice = researcher.getResearch( "getPassiveVoiceResult" );

	const passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	const assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );
	assessmentResult.setHasMarks( passiveVoiceResult.hasMarks );

	return assessmentResult;
};

/**
 * Checks if passive voice analysis is available for the language of the paper.
 *
 * @param {Paper}       paper       The paper to check.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {boolean} Returns true if the language is available and the paper is not empty.
 */
const isApplicable = function( paper, researcher ) {
	return paper.hasText() && researcher.hasResearch( "getPassiveVoiceResult" );
};

export default {
	identifier: "passiveVoice",
	getResult: passiveVoiceAssessment,
	isApplicable: isApplicable,
	getMarks: passiveVoiceMarker,
};
