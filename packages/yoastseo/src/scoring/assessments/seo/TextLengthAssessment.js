import { inRange, merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment that will test if the text is long enough.
 */
export default class TextLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
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

			cornerstoneContent: false,
		};

		this.identifier = "textLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 * @param {Jed}         i18n        The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		const wordCount = researcher.getResearch( "wordCountInText" );
		const assessmentResult = new AssessmentResult();
		const calculatedResult = this.calculateResult( wordCount, i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Returns the score and the appropriate feedback string based on the current word count.
	 *
	 * @param {number}  wordCount   The amount of words to be checked against.
	 * @param {Jed}     i18n        The locale object.
	 *
	 * @returns {Object} The score and the feedback string.
	 */
	calculateResult( wordCount, i18n ) {
		if ( wordCount >= this._config.recommendedMinimum ) {
			return {
				score: this._config.scores.recommendedMinimum,
				resultText: i18n.sprintf(
					i18n.dngettext(
						"js-text-analysis",
						/* Translators: %1$d expands to the number of words in the text,
						%2$s expands to a link on yoast.com, %3$s expands to the anchor end tag */
						"%2$sText length%3$s: The text contains %1$d word. Good job!",
						"%2$sText length%3$s: The text contains %1$d words. Good job!",
						wordCount ),
					wordCount,
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( inRange( wordCount, 0, this._config.belowMinimum ) ) {
			let badScore = this._config.scores.farBelowMinimum;

			if ( inRange( wordCount, 0, this._config.veryFarBelowMinimum ) ) {
				badScore = this._config.scores.veryFarBelowMinimum;
			}

			return {
				score: badScore,
				resultText: i18n.sprintf(
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
				),
			};
		}

		if ( inRange( wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			if ( this._config.cornerstoneContent === false ) {
				return {
					score: this._config.scores.slightlyBelowMinimum,
					resultText: i18n.sprintf(
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
					),
				};
			}

			return {
				score: this._config.scores.slightlyBelowMinimum,
				resultText: i18n.sprintf(
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
				),
			};
		}

		return {
			score: this._config.scores.belowMinimum,
			resultText: i18n.sprintf(
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
			),
		};
	}
}
