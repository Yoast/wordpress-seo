import { __, _n, sprintf } from "@wordpress/i18n";
import { filter, merge } from "lodash-es";

import Assessment from "../assessment";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { getSubheadings } from "../../../languageProcessing/helpers/html/getSubheadings";
import getWords from "../../../languageProcessing/helpers/word/getWords";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Represents the assessment for calculating the text after each subheading.
 */
class SubheadingsDistributionTooLong extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				// The maximum recommended value of the subheading text.
				recommendedMaximumLength: 300,
				slightlyTooMany: 300,
				farTooMany: 350,
			},
			countTextIn: __( "words", "wordpress-seo" ),
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34x" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34y" ),
			scores: {
				goodShortTextNoSubheadings: 9,
				goodSubheadings: 9,
				okSubheadings: 6,
				badSubheadings: 3,
				badLongTextNoSubheadings: 2,
			},
			applicableIfTextLongerThan: 300,
			shouldNotAppearInShortText: false,
		};
		this.identifier = "subheadingsTooLong";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getSubheadingTextLength research and checks scores based on length.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		this._subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
		if	( researcher.getConfig( "subheadingsTooLong" ) ) {
			this._config = this.getLanguageSpecificConfig( researcher );
		}
		const countTextInCharacters = researcher.getConfig( "countCharacters" );
		if ( countTextInCharacters ) {
			this._config.countTextIn = __( "characters", "wordpress-seo" );
		}

		this._subheadingTextsLength = this._subheadingTextsLength.sort( function( a, b ) {
			return b.countLength - a.countLength;
		} );

		this._tooLongTextsNumber = this.getTooLongSubheadingTexts().length;

		const assessmentResult = new AssessmentResult();
		assessmentResult.setIdentifier( this.identifier );

		this._hasSubheadings = this.hasSubheadings( paper );

		const customCountLength = researcher.getHelper( "customCountLength" );
		this._textLength = customCountLength ? customCountLength( paper.getText() ) : getWords( paper.getText() ).length;

		const calculatedResult = this.calculateResult();
		calculatedResult.resultTextPlural = calculatedResult.resultTextPlural || "";
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Check if there is language-specific config, and if so, overwrite the current config with it.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 *
	 * @returns {Object} The config that should be used.
	 */
	getLanguageSpecificConfig( researcher ) {
		const currentConfig = this._config;
		const languageSpecificConfig = researcher.getConfig( "subheadingsTooLong" );
		// Check if a language has a default cornerstone configuration.
		if ( currentConfig.cornerstoneContent === true && languageSpecificConfig.hasOwnProperty( "cornerstoneParameters" ) ) {
			return merge( currentConfig, languageSpecificConfig.cornerstoneParameters );
		}

		// Use the default language-specific config for non-cornerstone condition
		return merge( currentConfig, languageSpecificConfig.defaultParameters );
	}

	/**
	 * Checks the applicability of the assessment based on the presence of text, and, if required, text length.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The language-specific or default researcher.
	 *
	 * @returns {boolean} True when there is text or when text is longer than the specified length and "shouldNotAppearInShortText" is set to true.
	 */
	isApplicable( paper, researcher ) {
		/**
		 * If the assessment should not appear for shorter texts, only set the assessment as applicable if the text meets the minimum required length.
		 * Language-specific length requirements and methods of counting text length may apply (e.g. for Japanese, the text should be counted in
		 * characters instead of words, which also makes the minimum required length higher).
		**/
		if ( this._config.shouldNotAppearInShortText ) {
			const customCountLength = researcher.getHelper( "customCountLength" );
			const customApplicabilityConfig = researcher.getConfig( "assessmentApplicability" ).subheadingDistribution;
			if ( customApplicabilityConfig ) {
				this._config.applicableIfTextLongerThan = customApplicabilityConfig;
			}

			const textLength = customCountLength ? customCountLength( paper.getText() ) : researcher.getResearch( "wordCountInText" );

			return paper.hasText() && textLength > this._config.applicableIfTextLongerThan;
		}

		return paper.hasText();
	}

	/**
	 * Checks whether the paper has subheadings.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is at least one subheading.
	 */
	hasSubheadings( paper ) {
		const subheadings = getSubheadings( paper.getText() );
		return subheadings.length > 0;
	}

	/**
	 * Counts the number of subheading texts that are too long.
	 *
	 * @returns {Array} The array containing subheading texts that are too long.
	 */
	getTooLongSubheadingTexts() {
		return filter( this._subheadingTextsLength, function( subheading ) {
			return subheading.countLength > this._config.parameters.recommendedMaximumLength;
		}.bind( this ) );
	}

	/**
	 * Calculates the score and creates a feedback string based on the subheading texts length.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult() {
		if ( this._textLength > this._config.applicableIfTextLongerThan ) {
			if ( this._hasSubheadings ) {
				const longestSubheadingTextLength = this._subheadingTextsLength[ 0 ].countLength;
				if ( longestSubheadingTextLength <= this._config.parameters.slightlyTooMany ) {
					// Green indicator.
					return {
						score: this._config.scores.goodSubheadings,
						resultText: sprintf(
							// Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
							__(
								"%1$sSubheading distribution%2$s: Great job!",
								"wordpress-seo"
							),
							this._config.urlTitle,
							"</a>"
						),
					};
				}

				if ( inRange( longestSubheadingTextLength, this._config.parameters.slightlyTooMany, this._config.parameters.farTooMany ) ) {
					// Orange indicator.
					return {
						score: this._config.scores.okSubheadings,
						resultText: sprintf(
							/*
							 * Translators: %1$s and %5$s expand to a link on yoast.com, %3$d to the number of text sections
							 * not separated by subheadings, %4$d expands to the recommended number of words following a
							 * subheading, %6$s expands to the word 'words' or 'characters', %2$s expands to the link closing tag.
							 */
							_n(
								// eslint-disable-next-line max-len
								"%1$sSubheading distribution%2$s: %3$d section of your text is longer than %4$d %6$s and is not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
								// eslint-disable-next-line max-len
								"%1$sSubheading distribution%2$s: %3$d sections of your text are longer than %4$d %6$s and are not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
								this._tooLongTextsNumber,
								"wordpress-seo"
							),
							this._config.urlTitle,
							"</a>",
							this._tooLongTextsNumber,
							this._config.parameters.recommendedMaximumLength,
							this._config.urlCallToAction,
							this._config.countTextIn
						),
					};
				}

				// Red indicator.
				return {
					score: this._config.scores.badSubheadings,
					resultText: sprintf(
						/* Translators: %1$s and %5$s expand to a link on yoast.com, %3$d to the number of text sections
						not separated by subheadings, %4$d expands to the recommended number of words or characters following a
						subheading, %6$s expands to the word 'words' or 'characters', %2$s expands to the link closing tag. */
						_n(
							// eslint-disable-next-line max-len
							"%1$sSubheading distribution%2$s: %3$d section of your text is longer than %4$d %6$s and is not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
							// eslint-disable-next-line max-len
							"%1$sSubheading distribution%2$s: %3$d sections of your text are longer than %4$d %6$s and are not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
							this._tooLongTextsNumber,
							"wordpress-seo"
						),
						this._config.urlTitle,
						"</a>",
						this._tooLongTextsNumber,
						this._config.parameters.recommendedMaximumLength,
						this._config.urlCallToAction,
						this._config.countTextIn
					),
				};
			}
			// Red indicator, use '2' so we can differentiate in external analysis.
			return {
				score: this._config.scores.badLongTextNoSubheadings,
				resultText: sprintf(
					/* Translators: %1$s and %3$s expand to a link to https://yoa.st/headings, %2$s expands to the link closing tag. */
					__(
						// eslint-disable-next-line max-len
						"%1$sSubheading distribution%2$s: You are not using any subheadings, although your text is rather long. %3$sTry and add some subheadings%2$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._config.urlCallToAction
				),
			};
		}
		if ( this._hasSubheadings ) {
			// Green indicator.
			return {
				score: this._config.scores.goodSubheadings,
				resultText: sprintf(
					/* Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag. */
					__(
						"%1$sSubheading distribution%2$s: Great job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		// Green indicator.
		return {
			score: this._config.scores.goodShortTextNoSubheadings,
			resultText: sprintf(
				/* Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag. */
				__(
					// eslint-disable-next-line max-len
					"%1$sSubheading distribution%2$s: You are not using any subheadings, but your text is short enough and probably doesn't need them.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			),
		};
	}
}

export default SubheadingsDistributionTooLong;
