var countWords = require( "../stringProcessing/countWords.js" );
var AssessmentResultCalculator = require( "../calculators/assessmentResultCalculator.js" );
var AssessmentResult = require( "../values/AssessmentResult.js" );

var getScoringConfiguration = function( i18n ) {
	return {
		scoreArray: [
			{
				min: 300,
				score: 9,

				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is more than the %2$d word recommended minimum." )
			},
			{
				range: [ 250, 300 ],
				score: 7,

				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is slightly below the %2$d word recommended minimum. " +
					"Add a bit more copy." )
			},
			{
				range: [ 200, 250 ],
				score: 5,

				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful " +
					"content on this topic for readers." )
			},
			{
				range: [ 100, 200 ],
				score: -10,

				//* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful " +
					"content on this topic for readers." )
			},
			{
				range: [ 0, 100 ],
				score: -20,

				/* translators: %1$d expands to the number of words in the text */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words. This is far too low and should be increased." )
			}
		],
		replacements: {
			"%1$d": "%%result%%",
			"%2$d": 300
		}
	};
};

var countWordsAssessment = function( paper, i18n ) {
	var result = 0;

	if ( paper.hasText() ) {
		result = countWords( paper.getText() );
	}

	var calculatedResult = new AssessmentResultCalculator( result, getScoringConfiguration( i18n ) );

	return new AssessmentResult( calculatedResult.score, calculatedResult.text );
};

module.exports =  countWordsAssessment;
