import { map } from "lodash-es";

import countTooLongSentences from "../../helpers/assessments/checkForTooLongSentences";
import formatNumber from "../../../helpers/formatNumber";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import addMark from "../../../markers/addMark";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { stripIncompleteTags as stripTags } from "../../../../../helpers/src/strings/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";

/**
 * Translates the score to a message the user can understand.
 *
 * @param {number} score        The score.
 * @param {number} percentage   The percentage.
 * @param {object} i18n         The object used for translations.
 * @param {Object} config       The config with sentence length score boundaries and recommended sentence length.
 *
 * @returns {string} A string.
 */
const translateScore = function( score, percentage,  i18n, config ) {
	const urlTitle = createAnchorOpeningTag( "https://yoa.st/34v" );
	const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/34w" );
	if ( score >= 7 ) {
		return i18n.sprintf(
			/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis",
				"%1$sSentence length%2$s: Great!" ),
			urlTitle,
			"</a>"
		);
	}

	return i18n.sprintf(
		/* Translators: %1$s and %6$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
			%3$d expands to percentage of sentences, %4$s expands to the recommended maximum sentence length,
			%5$s expands to the recommended maximum percentage. */
		i18n.dgettext( "js-text-analysis",
			"%1$sSentence length%2$s: %3$s of the sentences contain more than %4$s words, which is more than the recommended maximum of %5$s." +
			" %6$sTry to shorten the sentences%2$s." ),
		urlTitle,
		"</a>",
		percentage + "%",
		config.recommendedWordCount,
		config.slightlyTooMany + "%",
		urlCallToAction
	);
};

/**
 * Calculates the score for the given percentage.
 *
 * @param {number} percentage The percentage to calculate the score for.
 * @param {Object} config     The config with sentence length score boundaries and recommended sentence length.
 *
 * @returns {number} The calculated score.
 */
const calculateScore = function( percentage, config ) {
	let score;

	// Green indicator.
	if ( percentage <= config.slightlyTooMany ) {
		score = 9;
	}

	// Orange indicator.
	if ( inRange( percentage, config.slightlyTooMany, config.farTooMany ) ) {
		score = 6;
	}

	// Red indicator.
	if ( percentage > config.farTooMany ) {
		score = 3;
	}

	return score;
};

/**
 * Gets the sentences that are qualified as being too long.
 *
 * @param {array} sentences 		The sentences to filter through.
 * @param {number} recommendedCount The maximum recommended sentence length.
 *
 * @returns {array} Array with all the sentences considered to be too long.
 */
const getTooLongSentences = function( sentences, recommendedCount ) {
	return countTooLongSentences( sentences, recommendedCount );
};

/**
 * Get the total amount of sentences that are qualified as being too long.
 *
 * @param {Array} sentences 		The sentences to filter through.
 * @param {number} recommendedCount The maximum recommended sentence length.
 *
 * @returns {Number} The amount of sentences that are considered too long.
 */
const countTotalTooLongSentences = function( sentences, recommendedCount ) {
	return getTooLongSentences( sentences, recommendedCount ).length;
};

/**
 * Calculates the percentage of sentences that are too long.
 *
 * @param {Array} sentences 		The sentences to calculate the percentage for.
 * @param {number} recommendedCount The maximum recommended sentence length.
 *
 * @returns {number} The calculates percentage of too long sentences.
 */
const calculatePercentageTooLongSentences = function( sentences, recommendedCount ) {
	let percentage = 0;

	if ( sentences.length !== 0 ) {
		const tooLongTotal = countTotalTooLongSentences( sentences, recommendedCount );

		percentage = formatNumber( ( tooLongTotal / sentences.length ) * 100 );
	}

	return percentage;
};

/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {Researcher} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {AssessmentResult} The Assessment result.
 */
const getSentenceLengthResult = function( paper, researcher, i18n ) {
	const sentences = researcher.getResearch( "countSentencesFromText" );
	const languageSpecificConfig = researcher.getConfig( "sentenceLength" );
	const defaultConfig = {
		recommendedWordCount: 20,
		slightlyTooMany: 25,
		farTooMany: 30,
	};
	const config = languageSpecificConfig ? languageSpecificConfig : defaultConfig;

	const percentage = calculatePercentageTooLongSentences( sentences, config.recommendedWordCount );
	const score = calculateScore( percentage, config );

	const assessmentResult = new AssessmentResult();

	assessmentResult.setScore( score );
	assessmentResult.setText( translateScore( score, percentage, i18n, config ) );
	assessmentResult.setHasMarks( ( percentage > 0 ) );

	return assessmentResult;
};

/**
 * Mark the sentences.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 *
 * @returns {Array} Array with all the marked sentences.
 */
const getSentenceLengthMarks = function( paper, researcher ) {
	const sentenceCount = researcher.getResearch( "countSentencesFromText" );
	let recommendedWordCount = researcher.getConfig( "sentenceLength" ).recommendedWordCount;
	if ( typeof recommendedWordCount === "undefined" ) {
		recommendedWordCount = 20;
	}
	const sentenceObjects = getTooLongSentences( sentenceCount, recommendedWordCount );

	return map( sentenceObjects, function( sentenceObject ) {
		const sentence = stripTags( sentenceObject.sentence );
		return new Mark( {
			original: sentence,
			marked: addMark( sentence ),
		} );
	} );
};

/**
 * Checks whether the paper has text.
 *
 * @param {Paper} paper The paper to use for the assessment.
 *
 * @returns {boolean} True when there is text.
 */
const isApplicable = function( paper ) {
	return paper.hasText();
};

export default {
	identifier: "textSentenceLength",
	getResult: getSentenceLengthResult,
	isApplicable: isApplicable,
	getMarks: getSentenceLengthMarks,
	calculatePercentage: calculatePercentageTooLongSentences,
};
