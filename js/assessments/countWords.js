var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/number/inRange" );

var countWordsAssessment = function( paper, researcher, i18n ) {
	var score = 0;
	var text = "";
	var wordCount = researcher.getResearch( "wordCount" );

	if ( wordCount > 300 ) {
		score = 9;

		/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
		text = i18n.dngettext(
			"js-text-analysis",
			"The text contains %1$d word, this is more than the %2$d word recommended minimum.",
			"The text contains %1$d words, this is more than the %2$d word recommended minimum.",
			wordCount
		);
	}

	if ( inRange( wordCount, 250, 300 ) ) {
		score = 7;

		/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
		text = i18n.dngettext(
			"js-text-analysis",
			"The text contains %1$d word, this is slightly below the %2$d word recommended minimum. Add a bit more copy.",
			"The text contains %1$d words, this is slightly below the %2$d word recommended minimum. Add a bit more copy.",
			wordCount
		);
	}

	if ( inRange( wordCount, 200, 250 ) ) {
		score = 5;

		/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
		text = i18n.dngettext(
			"js-text-analysis",
			"The text contains %1$d word, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
			"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
			wordCount
		);
	}

	if ( inRange( wordCount, 100, 200 ) ) {
		score = -10;

		/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
		text = i18n.dngettext(
			"js-text-analysis",
			"The text contains %1$d word, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
			"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
			wordCount
		);
	}

	if ( inRange( wordCount, 0, 100 ) ) {
		score = -20;

		/* translators: %1$d expands to the number of words in the text */
		text = i18n.dngettext(
			"js-text-analysis",
			"The text contains %1$d word, this is far too low and should be increased.",
			"The text contains %1$d words, this is far too low and should be increased.",
			wordCount
		);
	}

	text = i18n.sprintf( text, wordCount, 300 );

	return new AssessmentResult( score, text );
};

module.exports = countWordsAssessment;
