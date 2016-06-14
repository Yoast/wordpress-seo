var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

var recommendedMinimum = 150;
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
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is more than the recommended minimum of %2$d word.",
				"This is more than the recommended minimum of %2$d words.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 125, 150 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is slightly below the recommended minimum of %2$d word. Add a bit more copy.",
				"This is slightly below the recommended minimum of %2$d words. Add a bit more copy.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 100, 125 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 50, 100 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 0, 50 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is far below the recommended minimum of %2$d word. Increase the word count with content that is relevant for the topic.",
				"This is far below the recommended minimum of %2$d words. Increase the word count with content that is relevant for the topic.",
				recommendedMinimum
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
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, recommendedMinimum ) );

	return assessmentResult;
};

module.exports = {
	identifier: "taxonomyTextLength",
	getResult: taxonomyTextLengthAssessment
};
