var countWords = require( "../stringProcessing/countWords.js" );

var Jed = require( "jed" );

var i18n = function() {
	var defaultTranslations = {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	};
	return new Jed( defaultTranslations );
}();

var countWordsScore = {
	scoreArray: [
		{
			min: 300,
			score: 9,

			/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
			text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is more than the %2$d word recommended minimum.")
		},
		{
			min: 250,
			max: 299,
			score: 7,

			/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
			text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is slightly below the %2$d word recommended minimum. Add a bit more copy.")
		},
		{
			min: 200,
			max: 249,
			score: 5,

			/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
			text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
		},
		{
			min: 100,
			max: 199,
			score: -10,

			//* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
			text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
		},
		{
			min: 0,
			max: 99,
			score: -20,

			/* translators: %1$d expands to the number of words in the text */
			text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words. This is far too low and should be increased.")
		}
	],
	replaceArray: [
		{ name: "wordCount", position: "%1$d", source: "matcher" },
		{ name: "recommendedWordcount", position: "%2$d", value: 300 }

	]
};

var countWordsAssessment = function( paper ){
	var assessmentResult = {};
	var result = { test: "wordCount"};
	result.result = 0;
	if ( paper.hasText() ){

		result.result = countWords( paper.getText() );
		var refObj = { config:{
			i18n: i18n
			}
		};
	}
	assessmentResult.result = result;
	assessmentResult.score = {
		scoreName: "wordCount",
		scoreArray: countWordsScore.scoreArray,
		replaceArray: countWordsScore.replaceArray
	};
	return assessmentResult;
};

module.exports =  countWordsAssessment;
