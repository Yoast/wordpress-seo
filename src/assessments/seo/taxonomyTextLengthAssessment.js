import AssessmentResult from "../../values/AssessmentResult.js";
import { inRange } from "lodash-es";

const recommendedMinimum = 150;
/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
const calculateWordCountResult = function( wordCount, i18n ) {
	const urlTitle = "<a href='https://yoa.st/34j' target='_blank'>";
	const urlCallToAction = "<a href='https://yoa.st/34k' target='_blank'>";

	if ( wordCount >= 150 ) {
		return {
			score: 9,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text,
					%2$s expands to a link on yoast.com, %3$s expands to the anchor end tag */
					"%2$sText length%3$s: The text contains %1$d word. Good job!",
					"%2$sText length%3$s: The text contains %1$d words. Good job!",
					wordCount ),
				wordCount,
				urlTitle,
				"</a>",
			),
		};
	}

	if ( inRange( wordCount, 125, 150 ) ) {
		return {
			score: 7,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text,
					%2$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					"%2$sText length%4$s: The text contains %1$d word.",
					"%2$sText length%4$s: The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "Text length: The text contains x words.",
					%3$s expands to a link on yoast.com,
					%4$s expands to the anchor end tag,
					%5$s expands to the recommended minimum of words. */
					"This is slightly below the recommended minimum of %5$d word. %3$sAdd a bit more copy%4$s.",
					"This is slightly below the recommended minimum of %5$d words. %3$sAdd a bit more copy%4$s.",
					recommendedMinimum
				),
				wordCount,
				urlTitle,
				urlCallToAction,
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
					/* Translators: %1$d expands to the number of words in the text,
					%2$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					"%2$sText length%4$s: The text contains %1$d word.",
					"%2$sText length%4$s: The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "Text length: The text contains x words.",
					%3$s expands to a link on yoast.com,
					%4$s expands to the anchor end tag,
					%5$s expands to the recommended minimum of words. */
					"This is below the recommended minimum of %5$d word. %3$sAdd more content%4$s.",
					"This is below the recommended minimum of %5$d words. %3$sAdd more content%4$s.",
					recommendedMinimum
				),
				wordCount,
				urlTitle,
				urlCallToAction,
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
					/* Translators: %1$d expands to the number of words in the text,
					%2$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					"%2$sText length%4$s: The text contains %1$d word.",
					"%2$sText length%4$s: The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "Text length: The text contains x words.",
					%3$s expands to a link on yoast.com,
					%4$s expands to the anchor end tag,
					%5$s expands to the recommended minimum of words. */
					"This is below the recommended minimum of %5$d word. %3$sAdd more content%4$s.",
					"This is below the recommended minimum of %5$d words. %3$sAdd more content%4$s.",
					recommendedMinimum
				),
				wordCount,
				urlTitle,
				urlCallToAction,
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
					/* Translators: %1$d expands to the number of words in the text,
					%2$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					"%2$sText length%4$s: The text contains %1$d word.",
					"%2$sText length%4$s: The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "Text length: The text contains x words.",
					%3$s expands to a link on yoast.com,
					%4$s expands to the anchor end tag,
					%5$s expands to the recommended minimum of words. */
					"This is far below the recommended minimum of %5$d word. %3$sAdd more content%4$s.",
					"This is far below the recommended minimum of %5$d words. %3$sAdd more content%4$s.",
					recommendedMinimum
				),
				wordCount,
				urlTitle,
				urlCallToAction,
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

export default {
	identifier: "taxonomyTextLength",
	getResult: taxonomyTextLengthAssessment,
};
