var AssessmentResult = require( "../values/AssessmentResult.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

/**
 * Calculates transition word result
 * @param {object} transitionWordSentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	var score, unboundedScore;
	var percentage = ( transitionWordSentences.transitionWordSentences / transitionWordSentences.totalSentences ) * 100;
	percentage     = formatNumber( percentage );
	var hasMarks   = ( percentage > 0 );

	// The 20 percentage points from 31.7 to 51.7 are scaled to a range of 6 score points: 6/20 = 0.3.
	// 51.7 scores 9, 31.7 scores 3.
	unboundedScore = 3 + ( 0.3  * ( percentage - 31.7 ) );

	// Scores exceeding 9 are 9, scores below 3 are 3.
	score = Math.max( Math.min( unboundedScore, 9 ), 3 );
	if ( score < 7 ) {
		var recommendedMinimum = 45;
		return {
			score: formatNumber( score ),
			hasMarks: hasMarks,
			text: i18n.sprintf(
				i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, " +
					"which is less than the recommended minimum of %2$s." ),
				percentage + "%", recommendedMinimum + "%" )
		};
	}

	return {
		score: formatNumber( score ),
		hasMarks: hasMarks,
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, which is great."
		), percentage + "%" )
	};
};

/**
 * Scores the percentage of sentences including one or more transition words.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result.
 */
var transitionWordsAssessment = function( paper, researcher, i18n ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );
	var transitionWordResult = calculateTransitionWordResult( transitionWordSentences, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( transitionWordResult.score );
	assessmentResult.setText( transitionWordResult.text );
	assessmentResult.setHasMarks( transitionWordResult.hasMarks );

	return assessmentResult;
};

/**
 * Marks text for the transition words assessment.
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher containing the necessary research.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
var transitionWordsMarker = function( paper, researcher ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );

	return map( transitionWordSentences.sentenceResults, function( sentenceResult ) {
		var sentence = sentenceResult.sentence;

		return new Mark( {
			original: sentence,
			marked: marker( sentence )
		} );
	} );
};

module.exports = {
	identifier: "textTransitionWords",
	getResult: transitionWordsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: transitionWordsMarker
};
