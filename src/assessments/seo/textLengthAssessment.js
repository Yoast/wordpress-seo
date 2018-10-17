import { inRange, merge } from "lodash-es";

import Assessment from "../../assessment";
import { createAnchorOpeningTag } from "../../queryStringAppender";
import AssessmentResult from "../../values/AssessmentResult";

/**
 * Assessment that will test if the text is long enough.
 */
class TextLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			recommendedMinimum: 300,
			slightlyBelowMinimum: 250,
			belowMinimum: 200,
			veryFarBelowMinimum: 100,

			scores: {
				recommendedMinimum: 9,
				slightlyBelowMinimum: 6,
				belowMinimum: 3,
				farBelowMinimum: -10,
				veryFarBelowMinimum: -20,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34n" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34o" ),
		};

		this.identifier = "textLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @param {Researcher} researcher The Researcher object containing all available researches.
	 * @param {Jed} i18n The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		let wordCount = researcher.getResearch( "wordCountInText" );
		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( this.calculateScore( wordCount ) );
		assessmentResult.setText(
			i18n.sprintf( this.translateScore( assessmentResult.getScore(), wordCount, i18n ), wordCount, this._config.recommendedMinimum ) );

		return assessmentResult;
	}

	/**
	 * Calculates the score based on the current word count.
	 *
	 * @param {number} wordCount The amount of words to be checked against.

	 * @returns {number|null} The score.
	 */
	calculateScore( wordCount ) {
		if ( wordCount >= this._config.recommendedMinimum ) {
			return this._config.scores.recommendedMinimum;
		}

		if ( inRange( wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			return this._config.scores.slightlyBelowMinimum;
		}

		if ( inRange( wordCount, this._config.belowMinimum, this._config.slightlyBelowMinimum ) ) {
			return this._config.scores.belowMinimum;
		}

		if ( inRange( wordCount, this._config.veryFarBelowMinimum, this._config.belowMinimum ) ) {
			return this._config.scores.farBelowMinimum;
		}

		if ( inRange( wordCount, 0, this._config.veryFarBelowMinimum ) ) {
			return this._config.scores.veryFarBelowMinimum;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} score The amount of words to be checked against.
	 * @param {number} wordCount The amount of words.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( score, wordCount, i18n ) {
		if ( score === this._config.scores.recommendedMinimum ) {
			return i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text,
					%2$s expands to a link on yoast.com, %3$s expands to the anchor end tag */
					"%2$sText length%3$s: The text contains %1$d word. Good job!",
					"%2$sText length%3$s: The text contains %1$d words. Good job!",
					wordCount ),
				wordCount,
				this._config.urlTitle,
				"</a>",
			);
		}

		if ( score === this._config.scores.slightlyBelowMinimum ) {
			return  i18n.sprintf(
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
					%5$d expands to the recommended minimum of words. */
					"This is slightly below the recommended minimum of %5$d word. %3$sAdd a bit more copy%4$s.",
					"This is slightly below the recommended minimum of %5$d words. %3$sAdd a bit more copy%4$s.",
					this._config.recommendedMinimum
				),
				wordCount,
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>",
				this._config.recommendedMinimum
			);
		}

		if ( score === this._config.scores.belowMinimum ) {
			return i18n.sprintf(
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
					%5$d expands to the recommended minimum of words. */
					"This is below the recommended minimum of %5$d word. %3$sAdd more content%4$s.",
					"This is below the recommended minimum of %5$d words. %3$sAdd more content%4$s.",
					this._config.recommendedMinimum
				),
				wordCount,
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>",
				this._config.recommendedMinimum
			);
		}

		if ( score === this._config.scores.farBelowMinimum || score === this._config.scores.veryFarBelowMinimum ) {
			return i18n.sprintf(
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
					%5$d expands to the recommended minimum of words. */
					"This is far below the recommended minimum of %5$d word. %3$sAdd more content%4$s.",
					"This is far below the recommended minimum of %5$d words. %3$sAdd more content%4$s.",
					this._config.recommendedMinimum
				),
				wordCount,
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>",
				this._config.recommendedMinimum
			);
		}

		return "";
	}
}

export default TextLengthAssessment;
