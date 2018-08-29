const AssessmentResult = require( "../../values/AssessmentResult.js" );
import { inRange } from "lodash-es";

const recommendedMinimum = 150;
/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
const calculateWordCountResult = function( wordCount, i18n ) {
	const url = "<a href='https://yoa.st/2pk' target='_blank'>";

	if ( wordCount >= 150 ) {
		return {
			score: 9,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text. */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag,	%4$s expands to the recommended minimum of words. */
					"This is more than or equal to the %2$srecommended minimum%3$s of %4$d word.",
					"This is more than or equal to the %2$srecommended minimum%3$s of %4$d words.",
					recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				recommendedMinimum
			),
		};
	}

	if ( inRange( wordCount, 125, 150 ) ) {
		return {
			score: 7,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text. */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag, %4$s expands to the recommended minimum of words. */
					"This is slightly below the %2$srecommended minimum%3$s of %4$d word. Add a bit more copy.",
					"This is slightly below the %2$srecommended minimum%3$s of %4$d words. Add a bit more copy.",
					recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				recommendedMinimum
			),
		};
	}

	if ( inRange( wordCount, 100, 125 ) ) {
		return {
			score: 5,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text. */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag, %4$s expands to the recommended minimum of words. */
					"This is below the %2$srecommended minimum%3$s of %4$d word. Add more content that is relevant for the topic.",
					"This is below the %2$srecommended minimum%3$s of %4$d words. Add more content that is relevant for the topic.",
					recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				recommendedMinimum
			),
		};
	}

	if ( inRange( wordCount, 50, 100 ) ) {
		return {
			score: -10,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text. */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag, %4$s expands to the recommended minimum of words. */
					"This is below the %2$srecommended minimum%3$s of %4$d word. Add more content that is relevant for the topic.",
					"This is below the %2$srecommended minimum%3$s of %4$d words. Add more content that is relevant for the topic.",
					recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				recommendedMinimum
			),
		};
	}

	if ( inRange( wordCount, 0, 50 ) ) {
		return {
			score: -20,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text. */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag,  %4$s expands to the recommended minimum of words. */
					"This is far below the %2$srecommended minimum%3$s of %4$d word. Add more content that is relevant for the topic.",
					"This is far below the %2$srecommended minimum%3$s of %4$d words. Add more content that is relevant for the topic.",
					recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				recommendedMinimum
			),
		};
	}
};

/**
 * Execute the Assessment and return a result.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {Jed} i18n The locale object.
 *
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
const taxonomyTextLengthAssessment = function( paper, researcher, i18n ) {
	const wordCount = researcher.getResearch( "wordCountInText" );
	const wordCountResult = calculateWordCountResult( wordCount, i18n );
	const assessmentResult = new AssessmentResult();

	assessmentResult.setScore( wordCountResult.score );
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, recommendedMinimum ) );

	return assessmentResult;
};

module.exports = {
	identifier: "taxonomyTextLength",
	getResult: taxonomyTextLengthAssessment,
};
