import { inRange } from "lodash-es";
import { merge } from "lodash-es";

import AssessmentResult from "../../values/AssessmentResult.js";
import Assessment from "../../assessment.js";

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
		const url = "<a href='https://yoa.st/2pk' target='_blank'>";

		if ( score === this._config.scores.recommendedMinimum ) {
			return i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag,	%4$s expands to the recommended minimum of words. */
					"This is more than or equal to the %2$srecommended minimum%3$s of %4$d word.",
					"This is more than or equal to the %2$srecommended minimum%3$s of %4$d words.",
					this._config.recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				this._config.recommendedMinimum
			);
		}

		if ( score === this._config.scores.slightlyBelowMinimum ) {
			return i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag, %4$s expands to the recommended minimum of words. */
					"This is slightly below the %2$srecommended minimum%3$s of %4$d word. Add a bit more copy.",
					"This is slightly below the %2$srecommended minimum%3$s of %4$d words. Add a bit more copy.",
					this._config.recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				this._config.recommendedMinimum
			);
		}

		if ( score === this._config.scores.belowMinimum ) {
			return i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag, %4$s expands to the recommended minimum of words. */
					"This is below the %2$srecommended minimum%3$s of %4$d word. Add more content that is relevant for the topic.",
					"This is below the %2$srecommended minimum%3$s of %4$d words. Add more content that is relevant for the topic.",
					this._config.recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				this._config.recommendedMinimum
			);
		}

		if ( score === this._config.scores.farBelowMinimum || score === this._config.scores.veryFarBelowMinimum ) {
			return i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of words in the text */
					"The text contains %1$d word.",
					"The text contains %1$d words.",
					wordCount
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag,  %4$s expands to the recommended minimum of words. */
					"This is far below the %2$srecommended minimum%3$s of %4$d word. Add more content that is relevant for the topic.",
					"This is far below the %2$srecommended minimum%3$s of %4$d words. Add more content that is relevant for the topic.",
					this._config.recommendedMinimum
				),
				wordCount,
				url,
				"</a>",
				this._config.recommendedMinimum
			);
		}

		return "";
	}
}

export default TextLengthAssessment;
