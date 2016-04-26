var AssessmentResult = require( "../values/AssessmentResult.js" );
var filter = require( "lodash/filter" );

/**
 *  Returns true or false, based on the length of the subheading text and the recommended value.
 * @param {number} recommendedValue The recommended value of subheading text length
 * @param {number} subheadingsTextLength The length of the text after the subheading
 * @returns {boolean} True if the length is smaller than the recommendedValue,
 * false if it is smaller.
 */
var isTextTooShort = function( recommendedValue, subheadingsTextLength ) {
	return subheadingsTextLength < recommendedValue;
};

/**
 * Counts the number of subheading texts that are too short.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} recommendedValue The recommended minimum value of the subheading text length
 * @returns {number} The number of subheading texts that are too short.
 */
var getTooShortSubheadingTexts = function( subheadingTextsLength, recommendedValue ) {
	var tooShortTexts = filter( subheadingTextsLength, isTextTooShort.bind( null, recommendedValue ) );
	return tooShortTexts.length;
};

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooLongTexts The number of subheading texts that are too long.
 * @param {number} recommendedValue The recommended minimum value of the subheading text length
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooShortTexts, recommendedValue, i18n ) {

	// Return empty result if there are no subheadings
	if ( subheadingTextsLength.length === 0 ) {
	return {};
}

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 40 steps, each step is 0.15.
	// Up to 267  is for scoring a 9, higher numbers give lower scores.
	var score = 3 + Math.max( Math.min( ( 6 / 40 ) * ( subheadingTextsLength[ 0 ] - 13 ), 6 ), 0 );

	if ( score >= 7 ) {
	return {
		score: score,
		text: i18n.sprintf(
		i18n.dgettext(
				"js-text-analysis",
				"The amount of words following after each of your subheadings all exceed the recommended minimum of %1$d words, which is great."
		), recommendedValue )
	};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
		i18n.dngettext(
				"js-text-analysis",
				"%1$d of the subheadings is followed by less than the recommended minimum of %2$d words. " +
				"Consider deleting that particular subheading, or the following subheading.",
				"%1$d of the subheadings are followed by less than the recommended minimum of %2$d words. " +
				"Consider deleting those particular subheadings, or the subheading following each of them.",
				tooShortTexts ),
			tooShortTexts, recommendedValue
		)
	};
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingsTextLength = function( paper, researcher, i18n ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	subheadingTextsLength = subheadingTextsLength.sort(
		function( a, b ) {
			return a - b;
		}
	);
	var recommendedValue = 40;
	var tooShortTexts = getTooShortSubheadingTexts( subheadingTextsLength, recommendedValue );
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooShortTexts, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsTextLengthresult.score );
	assessmentResult.setText( subheadingsTextLengthresult.text );

	return assessmentResult;
	};

	module.exports = {
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
