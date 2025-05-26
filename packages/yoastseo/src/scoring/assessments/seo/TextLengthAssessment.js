import { __, _n, sprintf } from "@wordpress/i18n";
import { inRange, merge } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Represents an assessment that checks the length of the text and gives feedback accordingly.
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
			countCharacters: false,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34n" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34o" ),

			cornerstoneContent: false,
			customContentType: "",
		};

		this.identifier = "textLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the Assessment and returns a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher ) {
		const textLength = researcher.getResearch( "wordCountInText" );

		if ( researcher.getConfig( "textLength" ) ) {
			this._config = this.getLanguageSpecificConfig( researcher );
		}

		this._config.countCharacters = !! researcher.getConfig( "countCharacters" );

		const calculatedResult = this.calculateResult( textLength.count );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks if there is language-specific config, and if so, overwrites the current config with it.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 *
	 * @returns {Object} The config that should be used.
	 */
	getLanguageSpecificConfig( researcher ) {
		const currentConfig = this._config;
		const languageSpecificConfig = researcher.getConfig( "textLength" );

		// Checks if a language has configuration for custom content types.
		if ( languageSpecificConfig.hasOwnProperty( currentConfig.customContentType ) ) {
			return merge( currentConfig, languageSpecificConfig[ currentConfig.customContentType ] );
		}

		// Checks if a language has a default cornerstone configuration.
		if ( currentConfig.cornerstoneContent === true && currentConfig.customContentType === "" &&
			languageSpecificConfig.hasOwnProperty( "defaultCornerstone" ) ) {
			return merge( currentConfig, languageSpecificConfig.defaultCornerstone );
		}

		// Uses the default language-specific config for posts and pages.
		return merge( currentConfig, languageSpecificConfig.defaultAnalysis );
	}

	/**
	 * Returns the feedback texts for the text length assessment.
	 *
	 * @returns {{firstSentence: (function(boolean, number): string), good: (function(string): string), slightlyBelow: (function(boolean, string): string), below: (function(boolean, string): string), farBelow: (function(boolean, string): string)}}
	 */
	getFeedbackTexts() {
		return {
			firstSentence: ( useCharacter, textLength ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					_n(
						"%2$sText length%3$s: The text contains %1$d word.",
						"%2$sText length%3$s: The text contains %1$d words.",
						textLength,
						"wordpress-seo"
					),
					textLength,
					this._config.urlTitle,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					_n(
						"%2$sText length%3$s: The text contains %1$d character.",
						"%2$sText length%3$s: The text contains %1$d characters.",
						textLength,
						"wordpress-seo"
					),
					textLength,
					this._config.urlTitle,
					"</a>"
				);
				return useCharacter ? characterFeedback : wordFeedback;
			},
			good: ( textContains ) => {
				return sprintf(
					/* translators: %1$s expands to the sentence "The text contains X word(s)." */
					__(
						"%1$s Good job!",
						"wordpress-seo"
					),
					textContains,
				);
			},
			slightlyBelow: ( useCharacter, textContains ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to the sentence "The text contains X word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s This is slightly below the recommended minimum of %1$d word. %3$sAdd more content%4$s.",
						"%2$s This is slightly below the recommended minimum of %1$d words. %3$sAdd more content%4$s.",
						this._config.recommendedMinimum,
						"wordpress-seo"
					),
					this._config.recommendedMinimum,
					textContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to the sentence "The text contains X character(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s This is slightly below the recommended minimum of %1$d character. %3$sAdd more content%4$s.",
						"%2$s This is slightly below the recommended minimum of %1$d characters. %3$sAdd more content%4$s.",
						this._config.recommendedMinimum,
						"wordpress-seo"
					),
					this._config.recommendedMinimum,
					textContains,
					this._config.urlCallToAction,
					"</a>"
				);
				return useCharacter ? characterFeedback : wordFeedback;
			},
			below: ( useCharacter, textContains ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to the sentence "The text contains X word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s This is below the recommended minimum of %1$d word. %3$sAdd more content%4$s.",
						"%2$s This is below the recommended minimum of %1$d words. %3$sAdd more content%4$s.",
						this._config.recommendedMinimum,
						"wordpress-seo"
					),
					this._config.recommendedMinimum,
					textContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to the sentence "The text contains X character(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s This is below the recommended minimum of %1$d character. %3$sAdd more content%4$s.",
						"%2$s This is below the recommended minimum of %1$d characters. %3$sAdd more content%4$s.",
						this._config.recommendedMinimum,
						"wordpress-seo"
					),
					this._config.recommendedMinimum,
					textContains,
					this._config.urlCallToAction,
					"</a>"
				);
				return useCharacter ? characterFeedback : wordFeedback;
			},
			farBelow: ( useCharacter, textContains ) => {
				const wordFeedback = sprintf(
					/* translators: %1$d expands to the number of words, %2$s expands to the sentence "The text contains X word(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s This is far below the recommended minimum of %1$d word. %3$sAdd more content%4$s.",
						"%2$s This is far below the recommended minimum of %1$d words. %3$sAdd more content%4$s.",
						this._config.recommendedMinimum,
						"wordpress-seo"
					),
					this._config.recommendedMinimum,
					textContains,
					this._config.urlCallToAction,
					"</a>"
				);
				const characterFeedback = sprintf(
					/* translators: %1$d expands to the number of characters, %2$s expands to the sentence "The text contains X character(s).", %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					_n(
						"%2$s This is far below the recommended minimum of %1$d character. %3$sAdd more content%4$s.",
						"%2$s This is far below the recommended minimum of %1$d characters. %3$sAdd more content%4$s.",
						this._config.recommendedMinimum,
						"wordpress-seo"
					),
					this._config.recommendedMinimum,
					textContains,
					this._config.urlCallToAction,
					"</a>"
				);
				return useCharacter ? characterFeedback : wordFeedback;
			},
		};
	}

	/**
	 * Returns the score and the appropriate feedback string based on the current word count
	 * for taxonomies (in WordPress) and collections (in Shopify).
	 *
	 * @param {number} textLength	The amount of words to be checked against.
	 * @returns {Object} The score and the feedback string.
	 */
	calculateTaxonomyResult( textLength ) {
		// Gets functions used to create feedback strings.
		const feedbackTexts = this.getFeedbackTexts();
		const firstSentence = feedbackTexts.firstSentence( this._config.countCharacters, textLength );

		if ( textLength >= this._config.recommendedMinimum ) {
			return {
				score: this._config.scores.recommendedMinimum,
				resultText: feedbackTexts.good( firstSentence ),
			};
		}
		if ( inRange( textLength, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			return {
				score: this._config.scores.slightlyBelowMinimum,
				resultText: feedbackTexts.slightlyBelow( this._config.countCharacters, firstSentence ),
			};
		}
		if ( inRange( textLength, this._config.veryFarBelowMinimum, this._config.slightlyBelowMinimum ) ) {
			return {
				score: this._config.scores.belowMinimum,
				resultText: feedbackTexts.below( this._config.countCharacters, firstSentence ),
			};
		}
		return {
			score: this._config.scores.veryFarBelowMinimum,
			resultText: sprintf(
				/* translators: %1$s expands to a link on yoast.com, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
				__(
					"%1$sText length%3$s: %2$sPlease add some content%3$s.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}

	/**
	 * Returns the score and the appropriate feedback string based on the current word count for every type of content.
	 *
	 * @param {number}  textLength   The amount of words to be checked against.
	 *
	 * @returns {Object} The score and the feedback string.
	 */
	calculateResult( textLength ) {
		const customContentTypes = [ "taxonomyAssessor", "collectionSEOAssessor", "collectionCornerstoneSEOAssessor" ];
		if ( customContentTypes.includes( this._config.customContentType ) ) {
			return this.calculateTaxonomyResult( textLength );
		}

		// Gets functions used to create feedback strings.
		const feedbackTexts = this.getFeedbackTexts();
		const firstSentence = feedbackTexts.firstSentence( this._config.countCharacters, textLength );

		if ( textLength >= this._config.recommendedMinimum ) {
			return {
				score: this._config.scores.recommendedMinimum,
				resultText: feedbackTexts.good( firstSentence ),
			};
		}

		if ( inRange( textLength, 0, this._config.belowMinimum ) ) {
			let badScore = this._config.scores.farBelowMinimum;

			if ( inRange( textLength, 0, this._config.veryFarBelowMinimum ) ) {
				badScore = this._config.scores.veryFarBelowMinimum;
			}

			return {
				score: badScore,
				resultText: feedbackTexts.farBelow( this._config.countCharacters, firstSentence ),
			};
		}

		if ( inRange( textLength, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			if ( this._config.cornerstoneContent === false ) {
				return {
					score: this._config.scores.slightlyBelowMinimum,
					resultText: feedbackTexts.slightlyBelow( this._config.countCharacters, firstSentence ),
				};
			}

			return {
				score: this._config.scores.slightlyBelowMinimum,
				resultText: feedbackTexts.below( this._config.countCharacters, firstSentence ),
			};
		}

		return {
			score: this._config.scores.belowMinimum,
			resultText: feedbackTexts.below( this._config.countCharacters, firstSentence ),
		};
	}
}
