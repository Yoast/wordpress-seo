var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var filter = require( "lodash/filter" );

/**
 * The function to use as a filter for too long paragraphs.
 * @param {number} recommendedValue The recommended maximum length of a paragraph.
 * @param {number} paragraphLength The number of words within a paragraph.
 * @returns {boolean} Returns true if paragraphLength exceeds recommendedValue.
 */
var isParagraphTooLong = function( recommendedValue, paragraphLength ) {
	return paragraphLength > recommendedValue;
};

/**
 * Returns an array containing only the paragraphs longer than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} recommendedValue The recommended maximum length of a paragraph.
 * @returns {number} The number of too long paragraphs.
 */
var getTooLongParagraphs = function( paragraphsLength, recommendedValue ) {
	var tooLongParagraphs = filter( paragraphsLength, isParagraphTooLong.bind( null, recommendedValue ) );
	return tooLongParagraphs.length;
};

/**
 * Returns the scores and text for the ParagraphTooLongAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooLongParagraphs The number of too long paragraphs.
 * @param {number} recommendedValue The recommended maximum length of a paragraph.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooLongParagraphs, recommendedValue, i18n ) {
	if ( paragraphsLength.length === 0 ) {
		return {};
	}
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 100 steps, each step is 0.06.
	// Up to 117 is for scoring a 9, higher numbers give lower scores.
	// floatingPointFix because of js rounding errors
	var score = 9 - Math.max( Math.min( ( 0.06 ) * ( paragraphsLength[ 0 ] - 117 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.dgettext( "js-text-analysis", "None of your paragraphs are too long, which is great." )
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of paragraphs, %2$d expands to the recommended value
		text: i18n.sprintf( i18n.dngettext( "js-text-analysis", "%1$d of the paragraphs contains more than the recommended maximum " +
			"of %2$d words. Are you sure all information is about the same topic, and therefore belongs in one single paragraph?",
			"%1$d of the paragraphs contain more than the recommended maximum of %2$d words. Are you sure all information within each of" +
			" these paragraphs is about the same topic, and therefore belongs in a single paragraph?", tooLongParagraphs ),
			tooLongParagraphs, recommendedValue )
	};
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );
	paragraphsLength = paragraphsLength.sort(
		function( a, b ) {
			return b - a;
		}
	);
	var recommendedValue = 150;
	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength, recommendedValue );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooLongParagraphs, recommendedValue, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( paragraphLengthResult.score );
	assessmentResult.setText( paragraphLengthResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
