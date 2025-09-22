import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import recommendedKeyphraseCount from "../../helpers/assessments/recommendedKeywordCount.js";
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { inRangeEndInclusive, inRangeStartEndInclusive, inRangeStartInclusive } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers";
import keyphraseLengthFactor from "../../helpers/assessments/keyphraseLengthFactor.js";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 * @typedef {import("../../../values/Mark").default } Mark
 */

/**
 * @typedef {Object} KeyphraseDensityConfig
 * @property {Object} parameters The parameters to use.
 * If word forms are not available:
 * @property {Object} parameters.noWordForms The parameters to use when no morphological forms are available.
 * @property {number} parameters.noWordForms.overMaximum The percentage of keyphrase instances in the text that
 * is way over the maximum.
 * @property {number} parameters.noWordForms.maximum The maximum percentage of keyphrase instances in the text.
 * @property {number} parameters.noWordForms.minimum The minimum percentage of keyphrase instances in the text.
 * If word forms are available:
 * @property {Object} parameters.multipleWordForms The parameters to use when morphological forms are available.
 * @property {number} parameters.multipleWordForms.overMaximum The percentage of keyphrase instances in the text that
 * is way over the maximum.
 * @property {number} parameters.multipleWordForms.maximum The maximum percentage of keyphrase instances in the text.
 * @property {number} parameters.multipleWordForms.minimum The minimum percentage of keyphrase instances in the text.
 * @property {Object} scores The scores to use.
 * @property {number} scores.wayOverMaximum The score to return if there are way too many instances of keyphrase in the text.
 * @property {number} scores.overMaximum The score to return if there are too many instances of keyphrase in the text.
 * @property {number} scores.correctDensity The score to return if there is a good number of keyphrase instances in the text.
 * @property {number} scores.underMinimum The score to return if there are not enough keyphrase instances in the text.
 * @property {number} scores.noKeyphraseOrText The score to return if there is no text or no keyphrase set.
 * @property {number} shortText The text length below in which the keyphrase should appear exactly once.
 * @property {string} urlTitle The URL to the Yoast article about keyphrase density.
 * @property {string} urlCallToAction The URL to the Yoast article about keyphrase density.
 */

/**
 * Represents the assessment that will assess if the keyphrase density is within the recommended range.
 */
class KeyphraseDensityAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 * @param {Object} [config={}]   The configuration to use.
	 */
	constructor( config = {} ) {
		super();

		/**
		 * The default configuration.
		 * @type KeyphraseDensityConfig
		 */
		const defaultConfig = {
			parameters: {
				noWordForms: {
					overMaximum: 4,
					maximum: 3,
					minimum: 0.5,
				},
				multipleWordForms: {
					overMaximum: 4,
					maximum: 3.5,
					minimum: 0.5,
				},
			},
			scores: {
				wayOverMaximum: -50,
				overMaximum: -10,
				correctDensity: 9,
				underMinimum: 4,
				noKeyphraseOrText: -50,
			},
			shortText: 100,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33v" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33w" ),
		};

		this.identifier = "keyphraseDensity";
		this._config = merge( defaultConfig, config );
	}


	/**
	 * Determines correct boundaries depending on the availability of morphological forms.
	 *
	 * @param {number} keyphraseLength The length of the keyphrase in words.
	 * @param {number} textLength The length of the text in words.
	 * @param {boolean} isShortText Whether the text is considered short.
	 * @returns {void}
	 */
	setBoundaries( keyphraseLength, textLength, isShortText ) {
		this._boundaries = this._config.parameters.noWordForms;

		if ( this._hasMorphologicalForms ) {
			this._boundaries = this._config.parameters.multipleWordForms;
		}
		this._minRecommendedKeyphraseCount = recommendedKeyphraseCount( keyphraseLength, this._boundaries.minimum, "min", textLength, isShortText );
		this._maxRecommendedKeyphraseCount = recommendedKeyphraseCount(  keyphraseLength, this._boundaries.maximum, "max", textLength, isShortText );
	}

	/**
	 * Runs the keyphrase density module, based on this returns an assessment
	 * result with a score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling the research.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		this._keyphraseCount = researcher.getResearch( "getKeyphraseCount" );
		const keyphraseLength = this._keyphraseCount.keyphraseLength;

		const assessmentResult = new AssessmentResult();

		// Whether the paper has the data needed to return meaningful feedback (keyphrase and text).
		this._canAssess = paper.hasKeyword() && paper.hasText();

		if ( this._canAssess ) {
			this._keyphraseDensityResult = researcher.getResearch( "getKeyphraseDensity" );
		} else {
			this._keyphraseDensityResult = { density: 0, textLength: 0 };
		}

		this._hasMorphologicalForms = researcher.getData( "morphology" ) !== false;
		this._textLength = this._keyphraseDensityResult.textLength;
		this._isShortText = this._textLength < this._config.shortText;
		this.setBoundaries( keyphraseLength, this._textLength, this._isShortText );
		// Safe access with fallback
		const density = this._keyphraseDensityResult?.density ?? 0;
		this._keyphraseDensity = density * keyphraseLengthFactor( keyphraseLength );
		const calculatedScore = this.calculateResult();

		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );
		assessmentResult.setHasMarks( this._keyphraseCount.count > 0 );

		// Only shows the AI button when there is a text with a keyphrase and not enough keyphrase density.
		if ( calculatedScore.score === this._config.scores.underMinimum && this._canAssess ) {
			assessmentResult.setHasAIFixes( true );
		}
		return assessmentResult;
	}

	/**
	 * Checks whether there are no keyphrase matches in the text.
	 *
	 * @returns {boolean} Returns true if the keyphrase count is 0.
	 */
	hasNoMatches() {
		return this._keyphraseCount.count === 0;
	}

	/**
	 * Checks whether there are too few keyphrase matches in the text.
	 *
	 * @returns {boolean} Returns true if the rounded keyphrase density is lower than the recommended minimum
	 * or if the keyphrase count is 1 and the text length is at least the short text limit.
	 */
	hasTooFewMatches() {
		return inRangeStartInclusive(
			this._keyphraseDensity,
			0,
			this._boundaries.minimum
		) || ( this._keyphraseCount.count === 1 && ! this._isShortText );
	}

	/**
	 * Checks whether there is a good number of keyphrase matches in the text.
	 *
	 * @returns {boolean} Returns true if the rounded keyphrase density is between the recommended minimum and maximum,
	 * or if the keyphrase count is 2 and the recommended minimum is at most 2,
	 * or if the text length is less than the short text limit and the keyphrase count is 1.
	 */
	hasGoodNumberOfMatches() {
		return inRangeStartEndInclusive( this._keyphraseDensity, this._boundaries.minimum, this._boundaries.maximum ) ||
			( this._keyphraseCount.count === 2 && this._minRecommendedKeyphraseCount <= 2 && ! this._isShortText ) ||
			( this._isShortText && this._keyphraseCount.count === 1 );
	}

	/**
	 * Checks whether the number of keyphrase matches in the text is between the
	 * recommended maximum and the specified overMaximum value.
	 *
	 * @returns {boolean} Returns true if the rounded keyphrase density is between
	 *                    the recommended maximum and the specified overMaximum
	 *                    value.
	 */
	hasTooManyMatches() {
		return inRangeEndInclusive(
			this._keyphraseDensity,
			this._boundaries.maximum,
			this._boundaries.overMaximum
		);
	}

	/**
	 * Returns the score for the keyphrase density.
	 *
	 *
	 * @returns {{score: number, resultText: string}} result object with a score and translation text.
	 */
	calculateResult() {
		if ( ! this._canAssess ) {
			return {
				score: this._config.scores.noKeyphraseOrText,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase density%3$s: %2$sPlease add both a keyphrase and some text containing the keyphrase%3$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		const keyphraseTimes = sprintf(
			/* translators: %1$s expands to a link to Yoast.com, %2$s expands to the anchor end tag, %3$d expands to the number of times the keyphrase occurred in the text. */
			_n(
				"%1$sKeyphrase density%2$s: The keyphrase was found %3$d time.",
				"%1$sKeyphrase density%2$s: The keyphrase was found %3$d times.",
				this._keyphraseCount.count,
				"wordpress-seo"
			),
			this._config.urlTitle,
			"</a>",
			this._keyphraseCount.count
		);
		const lessThanRecommended = sprintf(
			/* translators: %1$d expands to the recommended minimal number of times the keyphrase should occur in the text. */
			_n(
				"That's less than the recommended minimum of %1$d time for a text of this length. %2$sFocus on your keyphrase%3$s!",
				"That's less than the recommended minimum of %1$d times for a text of this length. %2$sFocus on your keyphrase%3$s!",
				this._minRecommendedKeyphraseCount,
				"wordpress-seo"
			),
			this._minRecommendedKeyphraseCount,
			this._config.urlCallToAction,
			"</a>"
		);

		if ( this.hasNoMatches() ) {
			const noKeyphraseFound = sprintf(
				/* translators: %1$s and %4$s expand to links to Yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sKeyphrase density%2$s: The keyphrase was found 0 times.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			);
			return {
				score: this._config.scores.underMinimum,
				resultText: noKeyphraseFound + " " + lessThanRecommended,
			};
		}

		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scores.underMinimum,
				resultText: keyphraseTimes + " " + lessThanRecommended,
			};
		}

		if ( this.hasGoodNumberOfMatches()  ) {
			return {
				score: this._config.scores.correctDensity,
				resultText: sprintf(
					/* translators:
					%1$s expands to a link to Yoast.com,
					%2$s expands to the anchor end tag,
					%3$d expands to the number of times the keyphrase occurred in the text. */
					_n(
						"%1$sKeyphrase density%2$s: The keyphrase was found %3$d time. This is great!",
						"%1$sKeyphrase density%2$s: The keyphrase was found %3$d times. This is great!",
						this._keyphraseCount.count,
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._keyphraseCount.count
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			const moreThanRecommended = sprintf(
				/* translators: %1$d expands to the recommended maximal number of times the keyphrase should occur in the text. */
				_n(
					"That's more than the recommended maximum of %1$d time for a text of this length. %2$sDon't overoptimize%3$s!",
					"That's more than the recommended maximum of %1$d times for a text of this length. %2$sDon't overoptimize%3$s!",
					this._maxRecommendedKeyphraseCount,
					"wordpress-seo"
				),
				this._maxRecommendedKeyphraseCount,
				this._config.urlCallToAction,
				"</a>"
			);
			return {
				score: this._config.scores.overMaximum,
				resultText: keyphraseTimes + " " + moreThanRecommended,
			};
		}

		const wayMoreThanRecommended = sprintf(
			/* translators: %1$d expands to the recommended maximal number of times the keyphrase should occur in the text. */
			_n(
				"That's way more than the recommended maximum of %1$d time for a text of this length. %2$sDon't overoptimize%3$s!",
				"That's way more than the recommended maximum of %1$d times for a text of this length. %2$sDon't overoptimize%3$s!",
				this._maxRecommendedKeyphraseCount,
				"wordpress-seo"
			),
			this._maxRecommendedKeyphraseCount,
			this._config.urlCallToAction,
			"</a>"
		);

		// Implicitly returns this if the rounded keyphrase density is higher than overMaximum.
		return {
			score: this._config.scores.wayOverMaximum,
			resultText: keyphraseTimes + " " + wayMoreThanRecommended,
		};
	}


	/**
	 * Marks the occurrences of keyphrase in the text for the keyphrase density assessment.
	 *
	 * @returns {Mark[]} Marks that should be applied.
	 */
	getMarks() {
		return this._keyphraseCount.markings;
	}
}

/**
 * This assessment checks if the keyphrase density is within the recommended range.
 * KeywordDensityAssessment was the previous name for KeyphraseDensityAssessment (hence the name of this file).
 * We keep (and expose) this assessment for backwards compatibility.
 *
 * @deprecated Use KeyphraseDensityAssessment instead.
 */
class KeywordDensityAssessment extends KeyphraseDensityAssessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config   The configuration to use.
	 */
	constructor( config = {} ) {
		super( config );
		this.identifier = "keywordDensity";
		console.warn( "This object is deprecated, use KeyphraseDensityAssessment instead." );
	}
}

export {
	KeyphraseDensityAssessment,
	KeywordDensityAssessment,
};

export default KeyphraseDensityAssessment;
