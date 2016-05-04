var AssessmentResult = require( "../values/AssessmentResult.js" );
var partition = require ( "lodash/partition" );
var sortBy = require ( "lodash/sortBy" );

/**
 * Counts the number too often used sentence beginnings and determines the lowest count within that group.
 * @param sentenceBeginnings {array} The array containing the objects containing the beginning words and counts.
 * @returns {object} The object containing the total number of too often used beginnings and the lowest count within those.
 */
var calculateSentenceBeginningsResult = function( sentenceBeginnings ) {
	var maximumConsecutiveDuplicates = 3;

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

/**
 * Scores the repetition of sentence beginnings in consecutive sentences.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result
 */
var sentenceBeginningsAssessment = function( paper, researcher, i18n ) {
	var sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	var sentenceBeginningsResult = calculateSentenceBeginningsResult( sentenceBeginnings, i18n );
	var assessmentResult = new AssessmentResult();
	if ( sentenceBeginningsResult.total > 0 ) {
		assessmentResult.setScore( 3 );
		assessmentResult.setText(
			i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",

					// translators: %1$s expands to number of consecutive sentences starting with the same word.
					"%2$d consecutive sentences start with the same word. Try to mix things up!",
					"Your text contains %1$d instances where %2$d or more consecutive sentences start with the same word. " +
					"Try to mix things up!",
					sentenceBeginningsResult.total
				),
			sentenceBeginningsResult.total, sentenceBeginningsResult.lowestCount )
		);
	}
	return assessmentResult;
};

module.exports = {
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
