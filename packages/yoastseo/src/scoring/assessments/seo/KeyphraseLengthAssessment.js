import { __, _n, sprintf } from "@wordpress/i18n";
import { merge, inRange } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";
import { inRangeEndInclusive, inRangeStartEndInclusive } from "../../helpers/assessments/inRange";
import processExactMatchRequest from "../../../languageProcessing/helpers/match/processExactMatchRequest";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Enumerator for the different types of counting methods for this assessment.
 * @type {Readonly<{WORDS: string, CONTENT_WORDS: string, CHARACTERS: string}>}
 */
const COUNT_TEXT_IN = Object.freeze( {
	WORDS: "words",
	CONTENT_WORDS: "content words",
	CHARACTERS: "characters",
} );

/**
 * Assessment to check whether the keyphrase has a good length.
 */
export default class KeyphraseLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {boolean} isProductPage Whether product page scoring is used or not.
	 * @param {Object} [config] The configuration to use.
	 * @param {Object} [config.parameters] The parameters to use for the assessment.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum length of the keyphrase (in words).
	 * @param {number} [config.parameters.acceptableMaximum] The acceptable maximum length of the keyphrase (in words).
	 * @param {Object} [config.scores] The scores to use for the assessment.
	 * @param {number} [config.scores.veryBad] The score to return if the length of the keyphrase is below recommended minimum.
	 * @param {number} [config.scores.consideration] The score to return if the length of the keyphrase is above acceptable maximum.
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
			countTextIn: COUNT_TEXT_IN.WORDS,
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
			this._config.countTextIn = COUNT_TEXT_IN.CHARACTERS;
		}

		/*
		 * Checks whether the keyphrase length is calculated with function words filtered out AND whether the keyphrase doesn't use double quotes.
		 * If both conditions are true, then the feedback string should output 'content words' instead of only 'words'.
		 * */
		const keyphrase = paper.getKeyword();
		if ( this._keyphraseLengthData.functionWords.length > 0 && ! processExactMatchRequest( keyphrase ).exactMatchRequested ) {
			this._config.countTextIn = COUNT_TEXT_IN.CONTENT_WORDS;
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
		if ( assessmentResult.getScore() < 9  ) {
			assessmentResult.setHasJumps( true );
			assessmentResult.setEditFieldName( "keyphrase" );
			assessmentResult.setEditFieldAriaLabel( __( "Edit your keyphrase", "wordpress-seo" ) );
		}

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

		if ( this._isProductPage && Object.hasOwn( customKeyphraseLengthConfig, "productPages" ) ) {
			// If a language has specific configuration for keyphrase length in product pages, that configuration is used.
			return merge( this._config, customKeyphraseLengthConfig.productPages );
		}

		// If a language has a configuration for keyphrase length for regular pages, that configuration is used.
		return merge( this._config, customKeyphraseLengthConfig.defaultAnalysis );
	}

	/**
	 * Returns the feedback texts for the conditions when the keyphrase is too long or too short.
	 *
	 * @returns {{lessThanMinimum: (function(string, string): string), firstSentence: (function(string): string), moreThanMinimum: (function(string, string): string), wayMoreThanMinimum: (function(string, string): string), wayLessThanMinimum: (function(string, string): string)}}
	 */
	getFeedbackTexts() {
		return {
			firstSentence: ( countTextIn ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					_n(
						"%2$sKeyphrase length%3$s: The keyphrase contains %1$d word.",
						"%2$sKeyphrase length%3$s: The keyphrase contains %1$d words.",
						this._keyphraseLengthData.keyphraseLength,
						"wordpress-seo"
					),
					this._keyphraseLengthData.keyphraseLength,
					this._config.urlTitle,
					"</a>"
				);
				const contentWordFeedback = sprintf(
					/* translators: %1$d expands to the number of content words, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					_n(
						"%2$sKeyphrase length%3$s: The keyphrase contains %1$d content word.",
						"%2$sKeyphrase length%3$s: The keyphrase contains %1$d content words.",
						this._keyphraseLengthData.keyphraseLength,
						"wordpress-seo"
					),
					this._keyphraseLengthData.keyphraseLength,
					this._config.urlTitle,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					_n(
						"%2$sKeyphrase length%3$s: The keyphrase contains %1$d character.",
						"%2$sKeyphrase length%3$s: The keyphrase contains %1$d characters.",
						this._keyphraseLengthData.keyphraseLength,
						"wordpress-seo"
					),
					this._keyphraseLengthData.keyphraseLength,
					this._config.urlTitle,
					"</a>"
				);
				if ( countTextIn === COUNT_TEXT_IN.WORDS ) {
					return wordFeedback;
				} else if ( countTextIn === COUNT_TEXT_IN.CONTENT_WORDS ) {
					return contentWordFeedback;
				}
				return characterFeedback;
			},
			moreThanMinimum: ( countTextIn, keyphraseContains ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to the sentence "The keyphrase contains X word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's more than the recommended maximum of %1$d word. %3$sMake it shorter%4$s!",
						"%2$s That's more than the recommended maximum of %1$d words. %3$sMake it shorter%4$s!",
						this._boundaries.recommendedMaximum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMaximum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const contentWordFeedback = sprintf(
					/* translators: %1$d expands to the number of content words, %2$s expands to the sentence "The keyphrase contains X content word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's more than the recommended maximum of %1$d content word. %3$sMake it shorter%4$s!",
						"%2$s That's more than the recommended maximum of %1$d content words. %3$sMake it shorter%4$s!",
						this._boundaries.recommendedMaximum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMaximum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to the sentence "The keyphrase contains X character(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's more than the recommended maximum of %1$d character. %3$sMake it shorter%4$s!",
						"%2$s That's more than the recommended maximum of %1$d characters. %3$sMake it shorter%4$s!",
						this._boundaries.recommendedMaximum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMaximum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				if ( countTextIn === COUNT_TEXT_IN.WORDS ) {
					return wordFeedback;
				} else if ( countTextIn === COUNT_TEXT_IN.CONTENT_WORDS ) {
					return contentWordFeedback;
				}
				return characterFeedback;
			},
			wayMoreThanMinimum: ( countTextIn, keyphraseContains ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to the sentence "The keyphrase contains X word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's way more than the recommended maximum of %1$d word. %3$sMake it shorter%4$s!",
						"%2$s That's way more than the recommended maximum of %1$d words. %3$sMake it shorter%4$s!",
						this._boundaries.recommendedMaximum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMaximum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const contentWordFeedback = sprintf(
					/* translators: %1$d expands to the number of content words, %2$s expands to the sentence "The keyphrase contains X content word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's way more than the recommended maximum of %1$d content word. %3$sMake it shorter%4$s!",
						"%2$s That's way more than the recommended maximum of %1$d content words. %3$sMake it shorter%4$s!",
						this._boundaries.recommendedMaximum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMaximum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to the sentence "The keyphrase contains X character(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's way more than the recommended maximum of %1$d character. %3$sMake it shorter%4$s!",
						"%2$s That's way more than the recommended maximum of %1$d characters. %3$sMake it shorter%4$s!",
						this._boundaries.recommendedMaximum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMaximum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				if ( countTextIn === COUNT_TEXT_IN.WORDS ) {
					return wordFeedback;
				} else if ( countTextIn === COUNT_TEXT_IN.CONTENT_WORDS ) {
					return contentWordFeedback;
				}
				return characterFeedback;
			},
			lessThanMinimum: ( countTextIn, keyphraseContains ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to the sentence "The keyphrase contains X word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's less than the recommended minimum of %1$d word. %3$sMake it longer%4$s!",
						"%2$s That's less than the recommended minimum of %1$d words. %3$sMake it longer%4$s!",
						this._boundaries.recommendedMinimum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMinimum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const contentWordFeedback = sprintf(
					/* translators: %1$d expands to the number of content words, %2$s expands to the sentence "The keyphrase contains X content word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's less than the recommended minimum of %1$d content word. %3$sMake it longer%4$s!",
						"%2$s That's less than the recommended minimum of %1$d content words. %3$sMake it longer%4$s!",
						this._boundaries.recommendedMinimum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMinimum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to the sentence "The keyphrase contains X character(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's less than the recommended minimum of %1$d character. %3$sMake it longer%4$s!",
						"%2$s That's less than the recommended minimum of %1$d characters. %3$sMake it longer%4$s!",
						this._boundaries.recommendedMinimum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMinimum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				if ( countTextIn === COUNT_TEXT_IN.WORDS ) {
					return wordFeedback;
				} else if ( countTextIn === COUNT_TEXT_IN.CONTENT_WORDS ) {
					return contentWordFeedback;
				}
				return characterFeedback;
			},
			wayLessThanMinimum: ( countTextIn, keyphraseContains ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to the sentence "The keyphrase contains X word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's way less than the recommended minimum of %1$d word. %3$sMake it longer%4$s!",
						"%2$s That's way less than the recommended minimum of %1$d words. %3$sMake it longer%4$s!",
						this._boundaries.recommendedMinimum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMinimum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const contentWordFeedback = sprintf(
					/* translators: %1$d expands to the number of content words, %2$s expands to the sentence "The keyphrase contains X content word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's way less than the recommended minimum of %1$d content word. %3$sMake it longer%4$s!",
						"%2$s That's way less than the recommended minimum of %1$d content words. %3$sMake it longer%4$s!",
						this._boundaries.recommendedMinimum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMinimum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to the sentence "The keyphrase contains X character(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s That's way less than the recommended minimum of %1$d character. %3$sMake it longer%4$s!",
						"%2$s That's way less than the recommended minimum of %1$d characters. %3$sMake it longer%4$s!",
						this._boundaries.recommendedMinimum,
						"wordpress-seo"
					),
					this._boundaries.recommendedMinimum,
					keyphraseContains,
					this._config.urlCallToAction,
					"</a>"
				);
				if ( countTextIn === COUNT_TEXT_IN.WORDS ) {
					return wordFeedback;
				} else if ( countTextIn === COUNT_TEXT_IN.CONTENT_WORDS ) {
					return contentWordFeedback;
				}
				return characterFeedback;
			},
		};
	}

	/**
	 * Calculates the result for product pages based on the keyphraseLength research.
	 * @returns {{score: number, resultText: string}} The score and feedback for a product page.
	 */
	calculateResultForProduct() {
		// Calculates very bad score for product pages.
		if ( this._keyphraseLengthData.keyphraseLength === 0 ) {
			return this.getNoKeyphraseFeedback();
		}

		// Calculates good score for product pages.
		if ( inRangeStartEndInclusive( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMinimum,
			this._boundaries.recommendedMaximum ) ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase length%2$s: Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		// Gets functions used to create feedback strings for the 'okay' and 'bad' assessment scores.
		const feedbackTexts = this.getFeedbackTexts();
		const firstSentence = feedbackTexts.firstSentence( this._config.countTextIn );

		// Calculates bad score for product pages.
		if ( this._keyphraseLengthData.keyphraseLength <= this._boundaries.acceptableMinimum ) {
			return {
				score: this._config.scores.bad,
				resultText: feedbackTexts.wayLessThanMinimum( this._config.countTextIn, firstSentence ),
			};
		}
		if ( this._keyphraseLengthData.keyphraseLength > this._boundaries.acceptableMaximum ) {
			return {
				score: this._config.scores.bad,
				resultText: feedbackTexts.wayMoreThanMinimum( this._config.countTextIn, firstSentence ),
			};
		}
		// Calculates okay score for product pages.
		if ( inRange( this._keyphraseLengthData.keyphraseLength, this._boundaries.acceptableMinimum, this._boundaries.recommendedMinimum ) ) {
			return {
				score: this._config.scores.okay,
				resultText: feedbackTexts.lessThanMinimum( this._config.countTextIn, firstSentence ),
			};
		}
		if ( inRangeEndInclusive( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMaximum,
			this._boundaries.acceptableMaximum ) ) {
			return {
				score: this._config.scores.okay,
				resultText: feedbackTexts.moreThanMinimum( this._config.countTextIn, firstSentence ),
			};
		}
	}

	/**
	 * Returns the feedback when no keyphrase was set.
	 * @returns {{score: number, resultText: string}} The score and feedback for when no keyphrase is set.
	 */
	getNoKeyphraseFeedback() {
		if ( this._config.isRelatedKeyphrase ) {
			return {
				score: this._config.scores.veryBad,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
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
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					"%1$sKeyphrase length%3$s: No focus keyphrase was set for this page. %2$sSet a keyphrase in order to calculate your SEO score%3$s.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}

	/**
	 * Calculates the result based on the keyphraseLength research.
	 * @returns {{score: number, resultText: string}} The score and feedback for a regular post.
	 */
	calculateResult() {
		if ( this._isProductPage ) {
			return this.calculateResultForProduct();
		}

		// Calculates scores for regular pages.
		if ( this._keyphraseLengthData.keyphraseLength < this._boundaries.recommendedMinimum ) {
			return this.getNoKeyphraseFeedback();
		}
		if ( inRange( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMinimum, this._boundaries.recommendedMaximum + 1 ) ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase length%2$s: Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		// Gets functions used to create feedback strings for the 'okay' and 'bad' assessment scores.
		const feedbackTexts = this.getFeedbackTexts();
		const firstSentence = feedbackTexts.firstSentence( this._config.countTextIn );

		if ( inRange( this._keyphraseLengthData.keyphraseLength, this._boundaries.recommendedMaximum + 1, this._boundaries.acceptableMaximum + 1 ) ) {
			return {
				score: this._config.scores.okay,
				resultText: feedbackTexts.moreThanMinimum( this._config.countTextIn, firstSentence ),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: feedbackTexts.wayMoreThanMinimum( this._config.countTextIn, firstSentence ),
		};
	}
}
