import { __, _n, sprintf } from "@wordpress/i18n";
import { inRange, merge } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
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
			countTextIn: {
				singular: __( "word", "wordpress-seo" ),
				plural: __( "words", "wordpress-seo" ),
			},
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
		const wordCount = researcher.getResearch( "wordCountInText" );

		if	( researcher.getConfig( "textLength" ) ) {
			this._config = this.getLanguageSpecificConfig( researcher );
		}

		const countTextInCharacters = researcher.getConfig( "countCharacters" );
		if ( countTextInCharacters ) {
			this._config.countTextIn.singular = __( "character", "wordpress-seo" );
			this._config.countTextIn.plural = __( "characters", "wordpress-seo" );
		}

		const calculatedResult = this.calculateResult( wordCount.count );

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
	 * Returns the score and the appropriate feedback string based on the current word count
	 * for taxonomies (in WordPress) and collections (in Shopify).
	 *
	 * @param {number} wordCount	The amount of words to be checked against.
	 * @returns {Object} The score and the feedback string.
	 */
	calculateTaxonomyResult( wordCount ) {
		if ( wordCount >= this._config.recommendedMinimum ) {
			return {
				score: this._config.scores.recommendedMinimum,
				resultText: sprintf(
					/* translators: %1$d expands to the number of words / characters in the text,
					%2$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
					%4$s expands to the word 'words' or 'characters'. */
					__(
						"%2$sText length%3$s: The text contains %1$d %4$s. Good job!",
						"wordpress-seo"
					),
					wordCount,
					this._config.urlTitle,
					"</a>",
					this._config.countTextIn.plural
				),
			};
		}
		if ( inRange( wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			return {
				score: this._config.scores.slightlyBelowMinimum,
				resultText: sprintf(
					/* translators: %1$d expands to the number of words / characters in the text,
					%2$s expands to a link on yoast.com, %3$s expands to a link on yoast.com,
					%4$s expands to the anchor end tag, %5$d expands to the recommended minimum of words / characters,
					%6$s expands to the word 'words' or 'characters'. */
					__(
						"%2$sText length%4$s: The text contains %1$d %6$s. This is slightly below the recommended minimum of %5$d %6$s. %3$sAdd more content%4$s.",
						"wordpress-seo"
					),
					wordCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					this._config.recommendedMinimum,
					this._config.countTextIn.plural
				),
			};
		}
		if ( inRange( wordCount, this._config.veryFarBelowMinimum, this._config.slightlyBelowMinimum ) ) {
			return {
				score: this._config.scores.belowMinimum,
				resultText: sprintf(
					/* translators: %1$d expands to the number of words / characters in the text,
							%2$s expands to a link on yoast.com, %3$s expands to a link on yoast.com,
							%4$s expands to the anchor end tag, %5$d expands to the recommended minimum of words / characters,
							%6$s expands to the word 'word' or 'character', %7$s expands to the word 'words' or 'characters'. */
					_n(
						"%2$sText length%4$s: The text contains %1$d %6$s. This is below the recommended minimum of %5$d %7$s. %3$sAdd more content%4$s.",
						"%2$sText length%4$s: The text contains %1$d %7$s. This is below the recommended minimum of %5$d %7$s. %3$sAdd more content%4$s.",
						wordCount,
						"wordpress-seo"
					),
					wordCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					this._config.recommendedMinimum,
					this._config.countTextIn.singular,
					this._config.countTextIn.plural
				),
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
	 * @param {number}  wordCount   The amount of words to be checked against.
	 *
	 * @returns {Object} The score and the feedback string.
	 */
	calculateResult( wordCount ) {
		const customContentTypes = [ "taxonomyAssessor", "collectionSEOAssessor", "collectionCornerstoneSEOAssessor" ];
		if ( customContentTypes.includes( this._config.customContentType ) ) {
			return this.calculateTaxonomyResult( wordCount );
		}
		if ( wordCount >= this._config.recommendedMinimum ) {
			return {
				score: this._config.scores.recommendedMinimum,
				resultText: sprintf(
					/* translators: %1$d expands to the number of words / characters in the text,
					%2$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
					%4$s expands to the word 'words' or 'characters'. */
					__(
						"%2$sText length%3$s: The text contains %1$d %4$s. Good job!",
						"wordpress-seo"
					),
					wordCount,
					this._config.urlTitle,
					"</a>",
					this._config.countTextIn.plural
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
				resultText: sprintf(
					/* translators: %1$d expands to the number of words / characters in the text,
					%2$s expands to a link on yoast.com, %3$s expands to a link on yoast.com,
					%4$s expands to the anchor end tag, %5$d expands to the recommended minimum of words / characters,
					%6$s expands to the word 'word' or 'character', %7$s expands to the word 'words' or 'characters'. */
					_n(
						"%2$sText length%4$s: The text contains %1$d %6$s. This is far below the recommended minimum of %5$d %7$s. %3$sAdd more content%4$s.",
						"%2$sText length%4$s: The text contains %1$d %7$s. This is far below the recommended minimum of %5$d %7$s. %3$sAdd more content%4$s.",
						wordCount,
						"wordpress-seo"
					),
					wordCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					this._config.recommendedMinimum,
					this._config.countTextIn.singular,
					this._config.countTextIn.plural
				),
			};
		}

		if ( inRange( wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			if ( this._config.cornerstoneContent === false ) {
				return {
					score: this._config.scores.slightlyBelowMinimum,
					resultText: sprintf(
						/* translators: %1$d expands to the number of words / characters in the text,
						%2$s expands to a link on yoast.com, %3$s expands to a link on yoast.com,
						%4$s expands to the anchor end tag, %5$d expands to the recommended minimum of words / characters,
						%6$s expands to the word 'words' or 'characters'. */
						__(
							"%2$sText length%4$s: The text contains %1$d %6$s. This is slightly below the recommended minimum of %5$d %6$s. %3$sAdd a bit more copy%4$s.",
							"wordpress-seo"
						),
						wordCount,
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>",
						this._config.recommendedMinimum,
						this._config.countTextIn.plural
					),
				};
			}

			return {
				score: this._config.scores.slightlyBelowMinimum,
				resultText: sprintf(
					/* translators: %1$d expands to the number of words / characters in the text,
						%2$s expands to a link on yoast.com, %3$s expands to a link on yoast.com,
						%4$s expands to the anchor end tag, %5$d expands to the recommended minimum of words / characters,
						%6$s expands to the word 'words' or 'characters'. */
					__(
						"%2$sText length%4$s: The text contains %1$d %6$s. This is below the recommended minimum of %5$d %6$s. %3$sAdd more content%4$s.",
						"wordpress-seo"
					),
					wordCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					this._config.recommendedMinimum,
					this._config.countTextIn.plural
				),
			};
		}

		return {
			score: this._config.scores.belowMinimum,
			resultText: sprintf(
				/* translators: %1$d expands to the number of words / characters in the text,
						%2$s expands to a link on yoast.com, %3$s expands to a link on yoast.com,
						%4$s expands to the anchor end tag, %5$d expands to the recommended minimum of words / characters,
						%6$s expands to the word 'words' or 'characters'. */
				__(
					"%2$sText length%4$s: The text contains %1$d %6$s. This is below the recommended minimum of %5$d %6$s. %3$sAdd more content%4$s.",
					"wordpress-seo"
				),
				wordCount,
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>",
				this._config.recommendedMinimum,
				this._config.countTextIn.plural
			),
		};
	}
}
