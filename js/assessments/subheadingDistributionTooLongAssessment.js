var AssessmentResult = require( "../values/AssessmentResult.js" );
var isTextTooLong = require( "../helpers/isValueTooLong" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

// The maximum recommended value of the subheading text.
var recommendedValue = 300;

/**
 * Counts the number of subheading texts that are too long.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @returns {number} The number of subheading texts that are too long.
 */
var getTooLongSubheadingTexts = function( subheadingTextsLength ) {
	return filter( subheadingTextsLength, function( subheading ) {
		return isTextTooLong( recommendedValue, subheading.wordCount );
	} );
};

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooLongTexts The number of subheading texts that are too long.
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooLongTexts, i18n ) {
	var score;

	// Return empty result if there are no subheadings
	if ( subheadingTextsLength.length === 0 ) {
		return {};
	}

	var longestSubheadingTextLength = subheadingTextsLength[ 0 ].wordCount;

	if ( longestSubheadingTextLength <= 300 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( longestSubheadingTextLength, 300, 350  ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( longestSubheadingTextLength > 350 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					"The amount of words following each of your subheadings doesn't exceed the recommended maximum of %1$d words, which is great."
				), recommendedValue )
		};
	}

	return {
		score: score,
		hasMarks: true,

		// Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				"%1$d of the subheadings is followed by more than the recommended maximum of %2$d words. Try to insert another subheading.",
				"%1$d of the subheadings are followed by more than the recommended maximum of %2$d words. Try to insert additional subheadings.",
				tooLongTexts ),
			tooLongTexts, recommendedValue
		)
	};
};

/**
 * Creates a marker for each text following a subheading that is too long.
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {Array} All markers for the current text.
 */
var subheadingsMarker = function( paper, researcher ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	var tooLongTexts = getTooLongSubheadingTexts( subheadingTextsLength );

	return map( tooLongTexts, function( tooLongText ) {
		var marked = marker( tooLongText.text );
		return new Mark( {
			original: tooLongText.text,
			marked: marked
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
			return b.wordCount - a.wordCount;
		}
	);
	var tooLongTexts = getTooLongSubheadingTexts( subheadingTextsLength ).length;
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooLongTexts, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsTextLengthresult.score );
	assessmentResult.setText( subheadingsTextLengthresult.text );
	// assessmentResult.setHasMarks( subheadingsTextLengthresult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingsTooLong",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: subheadingsMarker
};
