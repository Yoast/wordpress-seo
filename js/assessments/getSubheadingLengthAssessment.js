var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var getSubheadings = require( "../stringProcessing/getSubheadings.js" ).getSubheadings;
var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );

/**
 * Calculates the result based on the score from the researcher.
 * @param {number} score The lowest score of the subheadings.
 * @param {number} tooLongHeaders The number of subheadings that are too long.
 * @param {number} recommendedValue The recommended maximum length for subheadings.
 * @param {object} i18n The object used for translations.
 * @returns {object} resultObject with text and score.
 */
var subheadingsLengthScore = function( score, tooLongHeaders, recommendedValue, i18n ) {
	if ( score === 0 ) {
		return {};
	}

	if( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// translators: %1$d expands to the recommended maximum number of characters.
					"The length of all subheadings is less than or equal to the recommended maximum of %1$d characters, which is great."
				), recommendedValue
			)
		};
	}

	return {
		score: score,
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				// translators: %1$d expands to the number of subheadings. %2$d expands to the recommended maximum number of characters.
				"You have %1$d subheading containing more than the recommended maximum of %2$d characters.",
				"You have %1$d subheadings containing more than the recommended maximum of %2$d characters.",
				tooLongHeaders
			), tooLongHeaders, recommendedValue
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
var getSubheadingLength = function( paper, researcher, i18n ) {
	var subheadingsLength = researcher.getResearch( "getSubheadingLength" );
	var recommendedValue = 30;
	var tooLong = 0;
	var scores = [];
	var lowestScore = 0;

	if ( subheadingsLength.length > 0 ) {
		forEach( subheadingsLength, function( length ) {
			if( length > recommendedValue ) {
				tooLong++;
			}

			// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 20 steps, each step is 0.3.
			// Up to 23.4  is for scoring a 9, higher numbers give lower scores.
			scores.push( 9 - Math.max( Math.min( ( 0.3 ) * ( length - 23.4 ), 6 ), 0 ) );
		} );

		lowestScore = scores.sort(
			function( a, b ) {
				return a - b;
			}
		)[ 0 ];
	}

	// floatingPointFix because of js rounding errors
	lowestScore = fixFloatingPoint( lowestScore );

	var subheadingsLengthResult = subheadingsLengthScore( lowestScore, tooLong, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsLengthResult.score );
	assessmentResult.setText( subheadingsLengthResult.text );

	return assessmentResult;
};

/**
 * Marks text for the subheading length assessment
 *
 * @param {Paper} paper The paper that should be marked.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
function subheadingLengthMarker( paper ) {
	var subheadings = getSubheadings( paper.getText() );

	var lengthySubheadings = filter( subheadings, function( subheading ) {
		return subheading[ 2 ].length > 30;
	} );

	return map( lengthySubheadings, function( subheading ) {
		var innerText = subheading[ 2 ];
		var outerText = subheading[ 0 ];

		var marked = outerText.replace( innerText, marker( innerText ) );

		return new Mark( {
			original: outerText,
			marked: marked
		} );
	} );
}

module.exports = {
	identifier: "textSubheadingLength",
	getResult: getSubheadingLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: subheadingLengthMarker
};
