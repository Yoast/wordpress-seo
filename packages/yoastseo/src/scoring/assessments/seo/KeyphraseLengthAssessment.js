import { __, _n, sprintf } from "@wordpress/i18n";
import { merge, inRange } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import { inRangeEndInclusive, inRangeStartEndInclusive } from "../../helpers/assessments/inRange";
import processExactMatchRequest from "../../../languageProcessing/helpers/match/processExactMatchRequest";

/**
 * Assessment to check whether the keyphrase has a good length.
 */
class KeyphraseLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {boolean} isProductPage Whether product page scoring is used or not.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum length of the keyphrase (in words).
	 * @param {number} [config.parameters.acceptableMaximum] The acceptable maximum length of the keyphrase (in words).
	 * @param {number} [config.scores.veryBad] The score to return if the length of the keyphrase is below recommended minimum.
	 * @param {number} [config.scores.consideration] The score to return if the length of the keyphrase is above acceptable maximum.
	 *
	 * @returns {void}
	 */
	constructor( config, isProductPage = false ) {
		super();

		this.defaultConfig = {
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
			countTextIn: {
				singular: __( "word", "wordpress-seo" ),
				plural: __( "words", "wordpress-seo" ),
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33i" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33j" ),
			isRelatedKeyphrase: false,
		};

		this.identifier = "keyphraseLength";
		this._config = merge( this.defaultConfig, config );
		this._isProductPage = isProductPage;
	}

	/**
	 * Assesses the keyphrase presence and length.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	getResult( paper, researcher ) {
		this._keyphraseLengthData = researcher.getResearch( "keyphraseLength" );
		const assessmentResult = new AssessmentResult();

		const countTextInCharacters = researcher.getConfig( "countCharacters" );
		if ( countTextInCharacters ) {
			this._config.countTextIn.singular = __( "character", "wordpress-seo" );
			this._config.countTextIn.plural = __( "characters", "wordpress-seo" );
		}

		/*
		 * Checks whether the keyphrase length is calculated with function words filtered out AND whether the keyphrase doesn't use double quotes.
		 * If both conditions are true, then the feedback string should output 'content words' instead of only 'words'.
		 * */
		const keyphrase = paper.getKeyword();
		if ( this._keyphraseLengthData.functionWords.length > 0 && ! processExactMatchRequest( keyphrase ).exactMatchRequested ) {
			this._config.countTextIn.singular = __( "content word", "wordpress-seo" );
			this._config.countTextIn.plural = __( "content words", "wordpress-seo" );
		}

		/*
		 * Checks whether the researcher has custom config for the scoring boundaries and overrides the current config with it.
		 * If no custom config is found, makes boundaries less strict if the language doesn't have function word support.
		 * */
		const customConfig = researcher.getConfig( "keyphraseLength" );
		if ( customConfig ) {
			this._config = this.getCustomConfig( researcher );
		} else if ( this._keyphraseLengthData.functionWords.length === 0 ) {
			this._config.parameters = merge( {}, this._config.parameters, this._config.parametersNoFunctionWordSupport  );
		}

		// Set a variable that contains the scoring boundaries.
		this._boundaries = this._config.parameters;

		const calculatedResult = this.calculateResult();

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}
	/**
	 * Merges language-specific configurations for product/regular pages.
	 *
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {Object} Configuration to use.
	 */
	getCustomConfig( researcher ) {
		const customKeyphraseLengthConfig = researcher.getConfig( "keyphraseLength" );

		if ( this._isProductPage && customKeyphraseLengthConfig.hasOwnProperty( "productPages" ) ) {
			// If a language has specific configuration for keyphrase length in product pages, that configuration is used.
			return merge( this._config, customKeyphraseLengthConfig.productPages );
		}

		// If a language has a configuration for keyphrase length for regular pages, that configuration is used.
		return merge( this._config, customKeyphraseLengthConfig.defaultAnalysis );
	}
	/**
	 * Calculates the result based on the keyphraseLength research.
	 *
	 * @returns {Object} Object with score and text.
	 */
	calculateResult() {
		if ( this._isProductPage ) {
			// Calculates very bad score for product pages
			if ( this._keyphraseLengthData.keyphraseLength === 0 ) {
				if ( this._config.isRelatedKeyphrase ) {
					return {
						score: this._config.scores.veryBad,
						resultText: sprintf(
							/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
							__(
								"%1$sKeyphrase length%3$s: %2$sSet a keyphrase in order to calculate your SEO score%3$s.",
								"wordpress-seo"
							),
							this._config.urlTitle,
							this._config.urlCallToAction,
							"</a>"
						),
					};
				}
				return {
					score: this._config.scores.veryBad,
					resultText: sprintf(
						/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						__(
							// eslint-disable-next-line max-len
							"%1$sKeyphrase length%3$s: No focus keyphrase was set for this page. %2$sSet a keyphrase in order to calculate your SEO score%3$s.",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			// Calculates bad score for product pages
			if ( this._keyphraseLengthData.keyphraseLength <= this._boundaries.acceptableMinimum ) {
				return {
					score: this._config.scores.bad,
					resultText: sprintf(
						/* Translators:
						%1$d expands to the number of words / characters in the keyphrase,
						%2$d expands to the recommended maximum of words / characters in the keyphrase,
						%3$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
						%6$s expands to the word 'word' or 'character' or 'content word',
						%7$s expands to the word 'words' or 'characters' or 'content words'. */
						_n(
							// eslint-disable-next-line max-len
							"%3$sKeyphrase length%5$s: The keyphrase contains %1$d %6$s. That's way less than the recommended minimum of %2$d %7$s. %4$sMake it longer%5$s!",
							// eslint-disable-next-line max-len
							"%3$sKeyphrase length%5$s: The keyphrase contains %1$d %7$s. That's way less than the recommended minimum of %2$d %7$s. %4$sMake it longer%5$s!",
							this._keyphraseLengthData.keyphraseLength,
							"wordpress-seo"
						),
						this._keyphraseLengthData.keyphraseLength,
						this._boundaries.recommendedMinimum,
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>",
						this._config.countTextIn.singular,
						this._config.countTextIn.plural
					),
				};
			}
			if ( this._keyphraseLengthData.keyphraseLength > this._boundaries.acceptableMaximum ) {
				return {
					score: this._config.scores.bad,
					resultText: sprintf(
						/* Translators:
						%1$d expands to the number of words / characters in the keyphrase,
						%2$d expands to the recommended maximum of words / characters in the keyphrase,
						%3$s and %4$s expand to links on yoast.com,
						%5$s expands to the anchor end tag,
						%6$s expands to the word 'words' or 'characters' or 'content words'. */
						__(
							// eslint-disable-next-line max-len
							"%3$sKeyphrase length%5$s: The keyphrase contains %1$d %6$s. That's way more than the recommended maximum of %2$d %6$s. %4$sMake it shorter%5$s!",
							"wordpress-seo"
						),
						this._keyphraseLengthData.keyphraseLength,
						this._boundaries.recommendedMaximum,
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>",
						this._config.countTextIn.plural
					),
				};
			}
			// Calculates okay score for product pages
			if ( inRange( this._keyphraseLengthData.keyphraseLength, this._boundaries.acceptableMinimum, this._boundaries.recommendedMinimum ) ) {
				return {
					score: this._config.scores.okay,
					resultText: sprintf(
						/* Translators:
						%1$d expands to the number of words / characters in the keyphrase,
						%2$d expands to the recommended maximum of words / characters in the keyphrase,
						%3$s and %4$s expand to links on yoast.com,
						%5$s expands to the anchor end tag,
						%6$s expands to the word 'words' or 'characters' or 'content words'. */
						__(
							// eslint-disable-next-line max-len
							"%3$sKeyphrase length%5$s: The keyphrase contains %1$d %6$s. That's less than the recommended minimum of %2$d %6$s. %4$sMake it longer%5$s!",
							"wordpress-seo"
						),
						this._keyphraseLengthData.keyphraseLength,
						this._boundaries.recommendedMinimum,
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>",
						this._config.countTextIn.plural
					),
				};
			}
			if ( inRangeEndInclusive( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMaximum,
				this._boundaries.acceptableMaximum ) ) {
				return {
					score: this._config.scores.okay,
					resultText: sprintf(
						/* Translators:
						%1$d expands to the number of words / characters in the keyphrase,
						%2$d expands to the recommended maximum of words / characters in the keyphrase,
						%3$s and %4$s expand to links on yoast.com,
						%5$s expands to the anchor end tag,
						%6$s expands to the word 'words' or 'characters' or 'content words'. */
						__(
							// eslint-disable-next-line max-len
							"%3$sKeyphrase length%5$s: The keyphrase contains %1$d %6$s. That's more than the recommended maximum of %2$d %6$s. %4$sMake it shorter%5$s!",
							"wordpress-seo"
						),
						this._keyphraseLengthData.keyphraseLength,
						this._boundaries.recommendedMaximum,
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>",
						this._config.countTextIn.plural
					),
				};
			}
			// Calculates good score for product pages
			if ( inRangeStartEndInclusive( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMinimum,
				this._boundaries.recommendedMaximum ) ) {
				return {
					score: this._config.scores.good,
					resultText: sprintf(
						/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
						__(
							"%1$sKeyphrase length%2$s: Good job!",
							"wordpress-seo"
						),
						this._config.urlTitle,
						"</a>"
					),
				};
			}
		}

		// Calculates scores for regular pages
		if ( this._keyphraseLengthData.keyphraseLength < this._boundaries.recommendedMinimum ) {
			if ( this._config.isRelatedKeyphrase ) {
				return {
					score: this._config.scores.veryBad,
					resultText: sprintf(
						/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						__(
							"%1$sKeyphrase length%3$s: %2$sSet a keyphrase in order to calculate your SEO score%3$s.",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			return {
				score: this._config.scores.veryBad,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						// eslint-disable-next-line max-len
						"%1$sKeyphrase length%3$s: No focus keyphrase was set for this page. %2$sSet a keyphrase in order to calculate your SEO score%3$s.",
						"wordpress-seo"
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
				resultText: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase length%2$s: Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		if ( inRange( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMaximum + 1, this._boundaries.acceptableMaximum + 1 ) ) {
			return {
				score: this._config.scores.okay,
				resultText: sprintf(
					/* Translators:
					%1$d expands to the number of words / characters in the keyphrase,
					%2$d expands to the recommended maximum of words / characters in the keyphrase,
					%3$s and %4$s expand to links on yoast.com,
					%5$s expands to the anchor end tag,
					%6$s expands to the word 'words' or 'characters' or 'content words'. */
					__(
						// eslint-disable-next-line max-len
						"%3$sKeyphrase length%5$s: The keyphrase contains %1$d %6$s. That's more than the recommended maximum of %2$d %6$s. %4$sMake it shorter%5$s!",
						"wordpress-seo"
					),
					this._keyphraseLengthData.keyphraseLength,
					this._boundaries.recommendedMaximum,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					this._config.countTextIn.plural
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: sprintf(
				/* Translators:
				%1$d expands to the number of words / characters in the keyphrase,
				%2$d expands to the recommended maximum of words / characters in the keyphrase,
				%3$s and %4$s expand to links on yoast.com,
				%5$s expands to the anchor end tag,
				%6$s expands to the word 'words' or 'characters' or 'content words'. */
				__(
					// eslint-disable-next-line max-len
					"%3$sKeyphrase length%5$s: The keyphrase contains %1$d %6$s. That's way more than the recommended maximum of %2$d %6$s. %4$sMake it shorter%5$s!",
					"wordpress-seo"
				),
				this._keyphraseLengthData.keyphraseLength,
				this._boundaries.recommendedMaximum,
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>",
				this._config.countTextIn.plural
			),
		};
	}
}

export default KeyphraseLengthAssessment;
