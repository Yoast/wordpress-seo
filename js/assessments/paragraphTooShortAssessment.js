var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var filter = require( "lodash/filter" );


/**
 * The function to use as a filter for too short paragraphs.
 * @param {number} recommendedValue The recommended minimum length of a paragraph.
 * @param {number} paragraphLength The number of words within a paragraph.
 * @returns {boolean} Returns true if paragraphLength is lower than recommendedValue.
 */
var isParagraphTooShort = function( recommendedValue, paragraphLength ) {
	return paragraphLength < recommendedValue;
};

/**
 * Returns an array containing only the paragraphs shorter than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} recommendedValue The recommended minimum length of a paragraph.
 * @returns {number} The number of too short paragraphs.
 */
var getTooShortParagraphs = function( paragraphsLength, recommendedValue ) {
	var tooShortParagraphs = filter( paragraphsLength, isParagraphTooShort.bind( null, recommendedValue ) );
	return tooShortParagraphs.length;
};

/**
 * Returns the scores and text for the ParagraphTooShortAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooShortParagraphs The number of too short paragraphs.
 * @param {number} recommendedValue The recommended minimum length of a paragraph.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooShortParagraphs, recommendedValue, i18n ) {
	if ( paragraphsLength.length === 0 ) {
		return {};
	}

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 40 steps, each step is 0.15
	// Up to 13 is for scoring a 3, higher numbers give higher scores.
	// floatingPointFix because of js rounding errors
	var score = 3 + Math.max( Math.min( ( 0.15 ) * ( paragraphsLength[ 0 ] - 13 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.dgettext( "js-text-analysis", "None of your paragraphs are too short, which is great." )
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of paragraphs, %2$d expands to the recommended value
		text: i18n.sprintf( i18n.dngettext( "js-text-analysis", "%1$d of the paragraphs contains less than the recommended minimum " +
				"of %2$d words. Try to expand this paragraph, or connect it to the previous or next paragraph.",
				"%1$d of the paragraphs contain less than the recommended minimum of %2$d words.  Try to expand these paragraphs, " +
				"or connect each of them to the previous or next paragraph.", tooShortParagraphs ),
			tooShortParagraphs, recommendedValue )
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
			return a - b;
		}
	);
	var recommendedValue = 40;
	var tooShortParagraphs = getTooShortParagraphs( paragraphsLength, recommendedValue );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooShortParagraphs, recommendedValue, i18n );
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
