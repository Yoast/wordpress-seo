import { map } from "lodash-es";

import formatNumber from "../../../helpers/formatNumber";
import { inRangeStartInclusive as inRange } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { stripIncompleteTags as stripTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark.js";
import marker from "../../../markers/addMark.js";

/**
 * Calculates the actual percentage of transition words in the sentences.
 *
 * @param {object} sentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 *
 * @returns {number} The percentage of sentences containing a transition word.
 */
const calculateTransitionWordPercentage = function( sentences ) {
	if ( sentences.transitionWordSentences === 0 || sentences.totalSentences === 0 ) {
		return 0;
	}

	return formatNumber( ( sentences.transitionWordSentences / sentences.totalSentences ) * 100 );
};

/**
 * Calculates the score for the assessment based on the percentage of sentences containing transition words.
 *
 * @param {number} percentage The percentage of sentences containing transition words.
 *
 * @returns {number} The score.
 */
const calculateScoreFromPercentage = function( percentage ) {
	if ( percentage < 20 ) {
		// Red indicator.
		return 3;
	}

	if ( inRange( percentage, 20, 30 ) ) {
		// Orange indicator.
		return 6;
	}

	// Green indicator.
	return 9;
};

/**
 * Calculates transition word result.
 *
 * @param {object} transitionWordSentences  The object containing the total number of sentences and the number of sentences containing
 *                                          a transition word.
 * @param {object} i18n                     The object used for translations.
 *
 * @returns {object} Object containing score and text.
 */
const calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	const percentage = calculateTransitionWordPercentage( transitionWordSentences );
	const score = calculateScoreFromPercentage( percentage );
	const hasMarks   = ( percentage > 0 );
	const urlTitle = createAnchorOpeningTag( "https://yoa.st/34z" );
	const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/35a" );

	if ( score < 7 && percentage === 0 ) {
		return {
			score: formatNumber( score ),
			hasMarks: hasMarks,
			text: i18n.sprintf(
				/* Translators: %1$s and %3$s expand to a link to yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis",
					"%1$sTransition words%2$s: None of the sentences contain transition words. %3$sUse some%2$s."
				),
				urlTitle,
				"</a>",
				urlCallToAction ),
		};
	}

	if ( score < 7 ) {
		return {
			score: formatNumber( score ),
			hasMarks: hasMarks,
			text: i18n.sprintf(
				/* Translators: %1$s and %4$s expand to a link to yoast.com, %2$s expands to the anchor end tag,
				%3$s expands to the percentage of sentences containing transition words */
				i18n.dgettext( "js-text-analysis",
					"%1$sTransition words%2$s: Only %3$s of the sentences contain transition words, which is not enough. %4$sUse more of them%2$s."
				),
				urlTitle,
				"</a>",
				percentage + "%",
				urlCallToAction ),
		};
	}

	return {
		score: formatNumber( score ),
		hasMarks: hasMarks,
		text: i18n.sprintf(
			/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
			i18n.dgettext( "js-text-analysis",
				"%1$sTransition words%2$s: Well done!"
			),
			urlTitle,
			"</a>" ),
	};
};

/**
 * Scores the percentage of sentences including one or more transition words.
 *
 * @param {object} paper        The paper to use for the assessment.
 * @param {object} researcher   The researcher used for calling research.
 * @param {object} i18n         The object used for translations.
 *
 * @returns {object} The Assessment result.
 */
const transitionWordsAssessment = function( paper, researcher, i18n ) {
	const transitionWordSentences = researcher.getResearch( "findTransitionWords" );
	const transitionWordResult = calculateTransitionWordResult( transitionWordSentences, i18n );
	const assessmentResult = new AssessmentResult();

	assessmentResult.setScore( transitionWordResult.score );
	assessmentResult.setText( transitionWordResult.text );
	assessmentResult.setHasMarks( transitionWordResult.hasMarks );

	return assessmentResult;
};

/**
 * Marks text for the transition words assessment.
 *
 * @param {Paper}       paper       The paper to use for the marking.
 * @param {Researcher}  researcher  The researcher containing the necessary research.
 *
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
const transitionWordsMarker = function( paper, researcher ) {
	const transitionWordSentences = researcher.getResearch( "findTransitionWords" );

	return map( transitionWordSentences.sentenceResults, function( sentenceResult ) {
		let sentence = sentenceResult.sentence;
		sentence = stripTags( sentence );
		return new Mark( {
			original: sentence,
			marked: marker( sentence ),
		} );
	} );
};

/**
 * Checks if the transition words assessment is applicable to the paper.
 *
 * @param {Paper}       paper       The paper to check.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {boolean} Returns true if the language is available and the paper is not empty.
 */
const isApplicable = function( paper, researcher ) {
	return paper.hasText() && researcher.hasResearch( "findTransitionWords" );
};

export default {
	identifier: "textTransitionWords",
	getResult: transitionWordsAssessment,
	isApplicable: isApplicable,
	getMarks: transitionWordsMarker,
};
