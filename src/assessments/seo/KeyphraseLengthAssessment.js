import { isUndefined } from "lodash-es";
import { merge } from "lodash-es";
import { inRange } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";

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
			scores: {
				veryBad: -999,
				bad: 3,
				okay: 6,
				good: 9,
			},
			urlNoOrGoodKeyword: "<a href='https://yoa.st/2pdd' target='_blank'>",
			urlKeyphraseTooLong: "<a href='https://yoa.st/2pd' target='_blank'>",
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
		this._keyphraseLength = researcher.getResearch( "keyphraseLength" );
		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );

		if ( ! isUndefined( calculatedResult ) ) {
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( calculatedResult.resultText );
		}

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
		if ( this._keyphraseLength < this._config.parameters.recommendedMinimum ) {
			return {
				score: this._config.scores.veryBad,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"No %1$sfocus keyword%2$s was set for this page. If you do not set a focus keyword, no score can be calculated."
					),
					this._config.urlNoOrGoodKeyword,
					"</a>"
				),
			};
		}

		if ( inRange( this._keyphraseLength, this._config.parameters.recommendedMinimum, this._config.parameters.recommendedMaximum + 1 ) ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"Your %1$skeyphrase%2$s has a nice length."
					),
					this._config.urlNoOrGoodKeyword,
					"</a>"
				),
			};
		}

		if ( inRange( this._keyphraseLength, this._config.parameters.recommendedMaximum + 1, this._config.parameters.acceptableMaximum + 1 ) ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators:
					%1$d expands to the number of words in the keyphrase,
					%2$d expands to the recommended maximum of words in the keyphrase,
					%3$s expands to a link on yoast.com,
					%4$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"Your %3$skeyphrase%4$s is %1$d words long. That's more than the recommended maximum of %2$d words. " +
						"You might want to make the keyphrase a bit shorter."
					),
					this._keyphraseLength,
					this._config.parameters.recommendedMaximum,
					this._config.urlKeyphraseTooLong,
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
				%3$s expands to a link on yoast.com,
				%4$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"Your %3$skeyphrase%4$s is %1$d words long. That's way more than the recommended maximum of %2$d " +
					"words. Make the keyphrase shorter."
				),
				this._keyphraseLength,
				this._config.parameters.recommendedMaximum,
				this._config.urlKeyphraseTooLong,
				"</a>"
			),
		};
	}
}

export default KeyphraseLengthAssessment;
