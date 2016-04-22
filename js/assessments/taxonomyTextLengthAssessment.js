var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function( wordCount, i18n ) {
	if ( wordCount > 150 ) {
		return {
			score: 9,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, this is more than the %2$d word recommended minimum.",
				"The text contains %1$d words, this is more than the %2$d word recommended minimum.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 125, 150 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, this is slightly below the %2$d word recommended minimum. Add a bit more copy.",
				"The text contains %1$d words, this is slightly below the %2$d word recommended minimum. Add a bit more copy.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 100, 125 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 50, 100 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 0, 50 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word, this is far too low and should be increased.",
				"The text contains %1$d words, this is far too low and should be increased.",
				wordCount
			)
		};
	}
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var taxonomyTextLengthAssessment = function( paper, researcher, i18n ) {
	var wordCount = researcher.getResearch( "wordCountInText" );
	var wordCountResult = calculateWordCountResult( wordCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( wordCountResult.score );
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, 150 ) );

	return assessmentResult;
};

module.exports = { getResult: taxonomyTextLengthAssessment };
