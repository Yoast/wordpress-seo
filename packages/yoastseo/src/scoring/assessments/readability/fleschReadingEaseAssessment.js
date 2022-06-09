import { __, sprintf } from "@wordpress/i18n";
import { inRange, isUndefined } from "lodash-es";

import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import { sanitizeString } from "../../../languageProcessing";

/**
 * Calculates the assessment result based on the score.
 *
 * @param {Object} fleschReadingScore   The Flesch reading ease score.
 * @param {Object} scoresConfig         The Flesch reading ease assessment scores and borders.
 *
 * @returns {Object} Object with score and resultText.
 */
const calculateFleschReadingResult = function( fleschReadingScore, scoresConfig ) {
	// Results must be between 0 and 100;
	if ( fleschReadingScore < 0 ) {
		fleschReadingScore = 0;
	}

	if ( fleschReadingScore > 100 ) {
		fleschReadingScore = 100;
	}

	let score;
	let feedback = "";
	let note = __( "Good job!", "wordpress-seo" );
	const urlTitle = createAnchorOpeningTag( "https://yoa.st/34r" );
	const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/34s" );

	if ( fleschReadingScore >= scoresConfig.borders.veryEasy ) {
		score = scoresConfig.scores.veryEasy;
		feedback = __( "very easy", "wordpress-seo" );
	} else if ( inRange( fleschReadingScore, scoresConfig.borders.easy, scoresConfig.borders.veryEasy ) ) {
		score = scoresConfig.scores.easy;
		feedback = __( "easy", "wordpress-seo" );
	} else if ( inRange( fleschReadingScore, scoresConfig.borders.fairlyEasy, scoresConfig.borders.easy ) ) {
		score = scoresConfig.scores.fairlyEasy;
		feedback = __( "fairly easy", "wordpress-seo" );
	} else if ( inRange( fleschReadingScore, scoresConfig.borders.okay, scoresConfig.borders.fairlyEasy ) ) {
		score = scoresConfig.scores.okay;
		feedback = __( "ok", "wordpress-seo" );
	} else if ( inRange( fleschReadingScore, scoresConfig.borders.fairlyDifficult, scoresConfig.borders.okay ) ) {
		score = scoresConfig.scores.fairlyDifficult;
		feedback = __( "fairly difficult", "wordpress-seo" );
		note = __( "Try to make shorter sentences to improve readability", "wordpress-seo" );
	} else if ( inRange( fleschReadingScore, scoresConfig.borders.difficult, scoresConfig.borders.fairlyDifficult ) ) {
		score = scoresConfig.scores.difficult;
		feedback = __( "difficult", "wordpress-seo" );
		note = __( "Try to make shorter sentences, using less difficult words to improve readability", "wordpress-seo" );
	} else {
		score = scoresConfig.scores.veryDifficult;
		feedback = __( "very difficult", "wordpress-seo" );
		note = __( "Try to make shorter sentences, using less difficult words to improve readability", "wordpress-seo" );
	}

	// If the score is good, add a "Good job" message without a link to the Call-to-action article.
	if ( score >= scoresConfig.scores.okay ) {
		return {
			score: score,
			resultText: sprintf(
				/* Translators: %1$s expands to a link on yoast.com,
					%2$s to the anchor end tag,
					%3$s expands to the numeric Flesch reading ease score,
					%4$s to the easiness of reading,
					%5$s expands to a call to action based on the score */
				__(
					"%1$sFlesch Reading Ease%2$s: The copy scores %3$s in the test, which is considered %4$s to read. %5$s",
					"wordpress-seo"
				),
				urlTitle,
				"</a>",
				fleschReadingScore,
				feedback,
				note
			),
		};
	}
	// If the score is not good, add a Call-to-action message with a link to the Call-to-action article.
	return {
		score: score,
		resultText: sprintf(
			/* Translators: %1$s and %5$s expand to a link on yoast.com,
				%2$s to the anchor end tag,
				%7$s expands to the anchor end tag and a full stop,
				%3$s expands to the numeric Flesch reading ease score,
				%4$s to the easiness of reading,
				%6$s expands to a call to action based on the score */
			__(
				"%1$sFlesch Reading Ease%2$s: The copy scores %3$s in the test, which is considered %4$s to read. %5$s%6$s%7$s",
				"wordpress-seo"
			),
			urlTitle,
			"</a>",
			fleschReadingScore,
			feedback,
			urlCallToAction,
			note,
			"</a>."
		),
	};
};


/**
 * The assessment that runs the FleschReading on the paper.
 *
 * @param {Paper}       paper       The paper to run this assessment on.
 * @param {Researcher}  researcher  The researcher used for the assessment.
 *
 * @returns {Object} An assessmentResult with the score and formatted text.
 */
const getFleschReadingResult = function( paper, researcher ) {
	const fleschReadingScore = researcher.getResearch( "getFleschReadingScore" );
	const languageSpecificConfig = researcher.getConfig( "fleschReadingEaseScores" );
	const defaultConfig = {
		borders: {
			veryEasy: 90,
			easy: 80,
			fairlyEasy: 70,
			okay: 60,
			fairlyDifficult: 50,
			difficult: 30,
			veryDifficult: 0,
		},
		scores: {
			veryEasy: 9,
			easy: 9,
			fairlyEasy: 9,
			okay: 9,
			fairlyDifficult: 6,
			difficult: 3,
			veryDifficult: 3,
		},
	};
	const config = languageSpecificConfig ? languageSpecificConfig : defaultConfig;

	const fleschReadingResult = calculateFleschReadingResult( fleschReadingScore, config );

	const assessmentResult =  new AssessmentResult();

	assessmentResult.setScore( fleschReadingResult.score );
	assessmentResult.setText( fleschReadingResult.resultText );

	return assessmentResult;
};


/**
 * Checks if Flesch reading analysis is available.
 *
 * @param {Paper}       paper       The paper to check.
 * @param {Researcher}  researcher  The researcher object.
 * @param {number}		contentNeededForAssessment the minimum amount of characters that is required for this research to be applicable.
 *
 * @returns {boolean} Returns true if the assessment is available and paper not empty.
 */
const isApplicable = function( paper, researcher, contentNeededForAssessment = 50 ) {
	/*
	 Note: this code contains repetition from yoastseo/src/scoring/assessments/assessment.js.
	 If FleshReadingEase is refactored to a class that extends Assessment,
	 use this.hasEnoughContentForAssessment( paper ) instead of ext.length >= contentNeededForAssessment
	*/
	const text = sanitizeString( paper.getText() );

	return  ! isUndefined( paper ) && text.length >= contentNeededForAssessment &&
		researcher.hasResearch( "getFleschReadingScore" );
};

export default {
	identifier: "fleschReadingEase",
	getResult: getFleschReadingResult,
	isApplicable: isApplicable,
};
