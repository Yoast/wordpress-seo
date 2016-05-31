var AssessmentResult = require( "../values/AssessmentResult.js" );
var isTextTooShort = require( "../helpers/isValueTooShort" );
var filter = require( "lodash/filter" );

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
 * @param {number} tooShortTexts The number of subheading texts that are too long.
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
						"The number of words following each of your subheadings exceeds the recommended minimum of %1$d words, which is great."
				), recommendedValue
			)
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
			i18n.dngettext(
					"js-text-analysis",
					"The number of words following %1$d of your subheadings is less than or equal to the recommended minimum of %2$d words. " +
					"Consider deleting that particular subheading, or the following subheading.",
					"The number of words following %1$d of your subheadings is less than or equal to the recommended minimum of %2$d words. " +
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
	identifier: "subheadingTooShort",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
