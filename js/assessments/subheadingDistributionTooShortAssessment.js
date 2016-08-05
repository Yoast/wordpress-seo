var AssessmentResult = require( "../values/AssessmentResult.js" );
var isTextTooShort = require( "../helpers/isValueTooShort" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

// The minimum recommended value.
var recommendedValue = 40;

/**
 * Counts the number of subheading texts that are too short.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @returns {number} The number of subheading texts that are too short.
 */
var getTooShortSubheadingTexts = function( subheadingTextsLength ) {
	return filter( subheadingTextsLength, function( subheading ) {
		return isTextTooShort( recommendedValue, subheading.wordCount );
	} );
};

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooShortTexts The number of subheading texts that are too long.
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooShortTexts, i18n ) {

	// Return empty result if there are no subheadings
	if ( subheadingTextsLength.length === 0 ) {
		return {};
	}

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 40 steps, each step is 0.15.
	// Up to 267  is for scoring a 9, higher numbers give lower scores.
	var score = 3 + Math.max( Math.min( ( 6 / 40 ) * ( subheadingTextsLength[ 0 ].wordCount - 13 ), 6 ), 0 );

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
						"js-text-analysis",
						"The number of words following each of the subheadings exceeds the recommended minimum of %1$d words, which is great."
				), recommendedValue
			),
		};
	}
	return {
		score: score,
		hasMarks: true,

		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				// Translators: %1$d expands to the number of subheadings.
				"The number of words following %1$d of the subheadings is too small.",
				"The number of words following %1$d of the subheadings is too small.",
				tooShortTexts
			) + " " + i18n.dngettext(
				"js-text-analysis",
				// Translators: %2$d expands to the recommended value.
				"The recommended minimum is %2$d word.",
				"The recommended minimum is %2$d words.",
				recommendedValue
			) + " " + i18n.dngettext(
				"js-text-analysis",
				"Consider deleting that particular subheading, or the following subheading.",
				"Consider deleting those particular subheadings, or the subheading following each of them.",
				tooShortTexts
			),
			tooShortTexts,
			recommendedValue
		),
	};
};

/**
 * Creates a marker for each text following a subheading that is too short.
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {Array} All markers for the current text.
 */
var subheadingsMarker = function( paper, researcher ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	var tooShortTexts = getTooShortSubheadingTexts( subheadingTextsLength );

	return map( tooShortTexts, function( tooShortText ) {
		var marked = marker( tooShortText.text );
		return new Mark( {
			original: tooShortText.text,
			marked: marked,
		} );
	} );
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
			return a.wordCount - b.wordCount;
		}
	);

	var tooShortTexts = getTooShortSubheadingTexts( subheadingTextsLength ).length;
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooShortTexts, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( subheadingsTextLengthresult.score );
	assessmentResult.setText( subheadingsTextLengthresult.text );
	// assessmentResult.setHasMarks( subheadingsTextLengthresult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingTooShort",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: subheadingsMarker,
};
