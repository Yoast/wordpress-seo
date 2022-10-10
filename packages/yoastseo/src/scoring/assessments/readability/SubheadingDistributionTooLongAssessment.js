import { __, _n, sprintf } from "@wordpress/i18n";
import { filter, map, merge } from "lodash-es";
import marker from "../../../markers/addMark";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { getSubheadings } from "../../../languageProcessing/helpers/html/getSubheadings";
import getWords from "../../../languageProcessing/helpers/word/getWords";
import AssessmentResult from "../../../values/AssessmentResult";
import { stripFullTags as stripTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import wordCount from "../../../languageProcessing/helpers/word/countWords";

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
				badLongTextBeforeSubheadings: 2,
			},
			applicableIfTextLongerThan: 300,
			shouldNotAppearInShortText: false,
			cornerstoneContent: false,
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
		if ( researcher.getConfig( "subheadingsTooLong" ) ) {
			this._config = this.getLanguageSpecificConfig( researcher );
		}
		const countTextInCharacters = researcher.getConfig( "countCharacters" );
		if ( countTextInCharacters ) {
			this._config.countTextIn = __( "characters", "wordpress-seo" );
		}

		this._subheadingTextsLength.subHeadingTexts = this._subheadingTextsLength.subHeadingTexts.sort( function( a, b ) {
			return b.countLength - a.countLength;
		} );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setIdentifier( this.identifier );

		this._hasSubheadings = this.hasSubheadings( paper );

		// Give specific feedback for cases where the post starts with a long text without subheadings.
		const customCountLength = researcher.getHelper( "customCountLength" );
		let textPrecedingSubheading1Length = 0;
		if ( this._subheadingTextsLength.subHeadingTexts.length > 0 ) {
			// Find first subheading.
			const firstSubheading =  this._subheadingTextsLength.subHeadingTexts[ 0 ];
			// Retrieve text preceding first subheading.
			const textPrecedingSubheading1 = this._subheadingTextsLength.text.slice( 0, firstSubheading.index );
			textPrecedingSubheading1Length = customCountLength
				? customCountLength( textPrecedingSubheading1 )
				: wordCount( textPrecedingSubheading1 );
		}

		this._tooLongTexts = this.getTooLongSubheadingTexts();
		// Checks if the text preceding the first subheading is longer than the recommended maximum length.
		const isTextPrecedingFirstHLong = textPrecedingSubheading1Length > this._config.parameters.recommendedMaximumLength;
		/*
		 * If the text preceding the first subheading is longer than the recommended maximum length,
		 * add the text block to the array of too long texts.
		 */
		if ( isTextPrecedingFirstHLong ) {
			this._tooLongTexts.push( textPrecedingSubheading1Length );
		}

		this._tooLongTextsNumber = this._tooLongTexts.length;

		this._textLength = customCountLength ? customCountLength( paper.getText() ) : getWords( paper.getText() ).length;
		const calculatedResult = this.calculateResult( isTextPrecedingFirstHLong );

		calculatedResult.resultTextPlural = calculatedResult.resultTextPlural || "";
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		if ( calculatedResult.score > 2 && calculatedResult.score < 7 ) {
			assessmentResult.setHasMarks( true );
		}

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
			if ( researcher.getConfig( "subheadingsTooLong" ) ) {
				this._config = this.getLanguageSpecificConfig( researcher );
			}

			const customCountLength = researcher.getHelper( "customCountLength" );
			const textLength = customCountLength ? customCountLength( paper.getText() ) : researcher.getResearch( "wordCountInText" ).count;
			// Do not use hasEnoughContentForAssessment as it is redundant with textLength > this._config.applicableIfTextLongerThan.
			return  textLength > this._config.applicableIfTextLongerThan;
		}

		return this.hasEnoughContentForAssessment( paper );
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
	 * Creates a marker for each subheading that precedes a text that is too long.
	 *
	 * @returns {Array} All markers for the current text.
	 */
	getMarks() {
		return map( this.getTooLongSubheadingTexts(), function( { subheading } ) {
			subheading = stripTags( subheading );
			const marked = marker( subheading );
			return new Mark( {
				original: subheading,
				marked: marked,
			} );
		} );
	}

	/**
	 * Counts the number of subheading texts that are too long.
	 *
	 * @returns {Array} The array containing subheading texts that are too long.
	 */
	getTooLongSubheadingTexts() {
		return filter( this._subheadingTextsLength.subHeadingTexts, function( subheading ) {
			return subheading.countLength > this._config.parameters.recommendedMaximumLength;
		}.bind( this ) );
	}

	/**
	 * Calculates the score and creates a feedback string based on the subheading texts length.
	 *
	 * @param {boolean} isTextPrecedingFirstHLong   Whether the length of the text preceding the first subheading is longer
	 *                                              than the recommended maximum length.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult( isTextPrecedingFirstHLong ) {
		if ( this._textLength > this._config.applicableIfTextLongerThan ) {
			if ( this._hasSubheadings ) {
				if ( isTextPrecedingFirstHLong && this._tooLongTextsNumber < 2 ) {
					/*
					 * Red indicator. Returns this feedback if the text preceding the first subheading is long
					 * and the total number of too long texts is less than 2.
					 */
					return {
						score: this._config.scores.badLongTextBeforeSubheadings,
						resultText: sprintf(
							/* Translators: %1$s and %3$s expand to a link to https://yoa.st/headings, %2$s expands to the link closing tag. */
							__(
								// eslint-disable-next-line max-len
								"%1$sSubheading distribution%2$s: The beginning of your text is longer than %4$s words and is not separated by any subheadings. %3$sAdd subheadings to improve readability.%2$s",
								"wordpress-seo"
							),
							this._config.urlTitle,
							"</a>",
							this._config.urlCallToAction,
							this._config.parameters.recommendedMaximumLength
						),
					};
				}

				const longestSubheadingTextLength = this._subheadingTextsLength.subHeadingTexts[ 0 ].countLength;
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
