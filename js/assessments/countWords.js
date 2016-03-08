var countWords = require( "../stringProcessing/countWords.js" );
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/number/inRange" );

var countWordsAssessment = function( paper, i18n ) {
	var result = 0;
	var score = 0;
	var text = "";

	if ( paper.hasText() ) {
		result = countWords( paper.getText() );
	}

	if ( result > 300 ) {
		score = 9;

		/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
		text = i18n.dgettext(
			"js-text-analysis",
			"The text contains %1$d words, this is more than the %2$d word recommended minimum."
		);
	}

	if ( inRange( result, 250, 300 ) ) {
		score = 7;

		/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
		text = i18n.dgettext(
			"js-text-analysis",
			"The text contains %1$d words, this is slightly below the %2$d word recommended minimum. " +
			"Add a bit more copy."
		);
	}

	if ( inRange( result, 200, 250 ) ) {
		score = 5;

		/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
		text = i18n.dgettext(
			"js-text-analysis",
			"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful " +
			"content on this topic for readers."
		);
	}

	if ( inRange( result, 100, 200 ) ) {
		score = -10,

		//* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
		text = i18n.dgettext(
			"js-text-analysis",
			"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful " +
		    "content on this topic for readers."
		);
	}

	if ( inRange( result, 0, 100) ) {
		score = -20;

		/* translators: %1$d expands to the number of words in the text */
		text = i18n.dgettext(
			"js-text-analysis",
			"The text contains %1$d words, this is far too low and should be increased."
		);
	}

	text = i18n.sprintf( text, result, 300);

	return new AssessmentResult( score, text );
};

module.exports =  countWordsAssessment;
