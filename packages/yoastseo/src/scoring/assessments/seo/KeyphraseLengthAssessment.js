import { merge, inRange } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment to check whether the keyphrase has a good length.
 */
class KeyphraseLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum length of the keyphrase (in words).
	 * @param {number} [config.parameters.acceptableMaximum] The acceptable maximum length of the keyphrase (in words).
	 * @param {number} [config.scores.veryBad] The score to return if the length of the keyphrase is below recommended minimum.
	 * @param {number} [config.scores.consideration] The score to return if the length of the keyphrase is above acceptable maximum.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
				recommendedMaximum: 4,
				acceptableMaximum: 8,
			},
			parametersNoFunctionWordSupport: {
				recommendedMaximum: 6,
				acceptableMaximum: 9,
			},
			scores: {
				veryBad: -999,
				bad: 3,
				okay: 6,
				good: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33i" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33j" ),
			isRelatedKeyphrase: false,
		};

		this.identifier = "keyphraseLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses the keyphrase presence and length.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	getResult( paper, researcher, i18n ) {
		this._keyphraseLengthData = researcher.getResearch( "keyphraseLength" );
		const assessmentResult = new AssessmentResult();
		this._boundaries = this._config.parameters;

		// Make the boundaries less strict if the language of the current paper doesn't have function word support.
		if ( this._keyphraseLengthData.functionWords.length === 0 ) {
			this._boundaries = merge( {}, this._config.parameters, this._config.parametersNoFunctionWordSupport  );
		}

		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Calculates the result based on the keyphraseLength research.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} Object with score and text.
	 */
	calculateResult( i18n ) {
		if ( this._keyphraseLengthData.keyphraseLength < this._boundaries.recommendedMinimum ) {
			if ( this._config.isRelatedKeyphrase ) {
				return {
					score: this._config.scores.veryBad,
					resultText: i18n.sprintf(
						/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						i18n.dgettext(
							"js-text-analysis",
							"%1$sKeyphrase length%3$s: " +
							"%2$sSet a keyphrase in order to calculate your SEO score%3$s."
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			return {
				score: this._config.scores.veryBad,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase length%3$s: No focus keyphrase was set for this page. " +
						"%2$sSet a keyphrase in order to calculate your SEO score%3$s."
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( inRange( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMinimum, this._boundaries.recommendedMaximum + 1 ) ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase length%2$s: Good job!"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( inRange( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMaximum + 1, this._boundaries.acceptableMaximum + 1 ) ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators:
					%1$d expands to the number of words in the keyphrase,
					%2$d expands to the recommended maximum of words in the keyphrase,
					%3$s and %4$s expand to links on yoast.com,
					%5$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%3$sKeyphrase length%5$s: The keyphrase is %1$d words long. That's more than the recommended maximum of %2$d words. " +
							"%4$sMake it shorter%5$s!"
					),
					this._keyphraseLengthData.keyphraseLength,
					this._boundaries.recommendedMaximum,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: i18n.sprintf(
				/* Translators:
				%1$d expands to the number of words in the keyphrase,
				%2$d expands to the recommended maximum of words in the keyphrase,
				%3$s and %4$s expand to links on yoast.com,
				%5$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"%3$sKeyphrase length%5$s: The keyphrase is %1$d words long. That's way more than the recommended maximum of %2$d words. " +
					"%4$sMake it shorter%5$s!"
				),
				this._keyphraseLengthData.keyphraseLength,
				this._boundaries.recommendedMaximum,
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}

export default KeyphraseLengthAssessment;
