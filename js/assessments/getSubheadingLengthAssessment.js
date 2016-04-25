var AssessmentResult = require( "../values/AssessmentResult.js" );
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
	if( score >= 7 ) {
		return{
			score: score,
			text: i18n.dgettext( "js-text-analysis", "The length of all subheadings is within the recommended range." )
		};
	}
	return{
		score: score,
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				"You have %1$d subheading containing more than the recommended maximum of %2$d characters.",
				"You have %1$d subheadings containing more than the recommended maximum of %2$d characters.",
				tooLongHeaders
			), tooLongHeaders, recommendedValue )
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

	forEach( subheadingsLength, function( length ) {
		if( length > recommendedValue ) {
			tooLong++;
		}
		scores.push( 9 - Math.max( Math.min( ( 4 / 9 ) * ( length - 25.5 ), 6 ), 0 ) );
	} );

	var lowestScore = scores.sort(
		function( a, b ) {
			return a - b;
		}
	)[ 0 ];

	var subheadingsLengthResult = subheadingsLengthScore( lowestScore, tooLong, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsLengthResult.score );
	assessmentResult.setText( subheadingsLengthResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: getSubheadingLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
