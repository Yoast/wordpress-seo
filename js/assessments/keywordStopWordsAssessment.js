var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on the amount of stop words in the keyword.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateStopWordsCountResult = function( stopWordCount, i18n ) {

	if ( stopWordCount > 0 ) {
		return {
			score: 0,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$s opens a link to a Yoast article about stop words, %2$s closes the link */
				"The focus keyword contains a stop word. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				"The focus keyword contains %3$d stop words. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				stopWordCount
			),
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var keywordHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInKeyword" );
	var stopWordsResult = calculateStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		"<a href='https://yoast.com/handling-stopwords/' target='new'>",
		"</a>",
		stopWords.length
	) );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordStopWords",
	getResult: keywordHasStopWordsAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	},
};
