var AssessmentResult = require( "../values/AssessmentResult.js" );
var partition = require ( "lodash/partition" );
var sortBy = require ( "lodash/sortBy" );

/**
 * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
 * @param {array} sentenceBeginnings The array containing the objects containing the beginning words and counts.
 * @returns {object} The object containing the total number of too often used beginnings and the lowest count within those.
 */
var groupSentenceBeginnings = function( sentenceBeginnings ) {
	var maximumConsecutiveDuplicates = 2;

	var tooOften = partition( sentenceBeginnings, function ( word ) {
		return word.count > maximumConsecutiveDuplicates;
	} );
	if ( tooOften[ 0 ].length === 0 ) {
		return { total: 0 };
	}
	var sortedCounts = sortBy( tooOften[ 0 ], function( word ) {
		return word.count;
	} );
	return { total: tooOften[ 0 ].length, lowestCount: sortedCounts[ 0 ].count };
};

var calculateSentenceBeginningsResult = function( groupedSentenceBeginnings, i18n ) {
	if ( groupedSentenceBeginnings.total > 0 ) {
		return {
			score: 3,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",

					// translators: %1$d expands to the number of instances where 3 or more consecutive sentences start
					// with the same word.
					// %2$d expands to the number of consecutive sentences starting with the same word.
					"Your text contains %2$d consecutive sentences starting with the same word. Try to mix things up!",
					"Your text contains %1$d instances where %2$d or more consecutive sentences start with the same word. " +
					"Try to mix things up!",
					groupedSentenceBeginnings.total
				),
				groupedSentenceBeginnings.total, groupedSentenceBeginnings.lowestCount )
		};
	}
	return {};
};

/**
 * Scores the repetition of sentence beginnings in consecutive sentences.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result
 */
var sentenceBeginningsAssessment = function( paper, researcher, i18n ) {
	var sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	var groupedSentenceBeginnings = groupSentenceBeginnings( sentenceBeginnings );
	var sentenceBeginningsResult = calculateSentenceBeginningsResult ( groupedSentenceBeginnings, i18n );
	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceBeginningsResult.score );
	assessmentResult.setText( sentenceBeginningsResult.text );
	return assessmentResult;
};

module.exports = {
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

