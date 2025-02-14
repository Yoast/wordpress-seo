import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";
import marker from "../../../markers/addMark";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { getSubheadings } from "../../../languageProcessing/helpers/html/getSubheadings";
import getWords from "../../../languageProcessing/helpers/word/getWords";
import AssessmentResult from "../../../values/AssessmentResult";
import { stripFullTags as stripTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import removeHtmlBlocks from "../../../languageProcessing/helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../../../languageProcessing/helpers";

/**
 * Represents the assessment that checks whether a text has a good distribution of subheadings.
 */
class SubheadingsDistributionTooLong extends Assessment {
	/**
	 * Creates an instance of SubheadingsDistributionTooLong.
	 * @constructor
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {Object} [config.parameters] The parameters to use.
	 * @param {number} [config.parameters.recommendedMaximumLength=300] The maximum recommended length of a text without a subheading.
	 * @param {number} [config.parameters.slightlyTooMany=300] The maximum length of a text without a subheading that is still acceptable.
	 * @param {number} [config.parameters.farTooMany=350] The maximum length of a text without a subheading that is too long.
	 * @param {string} [config.countCharacters=false] Whether to count characters instead of words.
	 * @param {string} [config.urlTitle] The URL to an article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to an article about this assessment.
	 * @param {Object} [config.scores] The scores to use.
	 * @param {number} [config.scores.goodShortTextNoSubheadings=9] The score to return when the text is short and has no subheadings.
	 * @param {number} [config.scores.goodSubheadings=9] The score to return when the subheading distribution is good.
	 * @param {number} [config.scores.okSubheadings=6] The score to return when the subheading distribution is okay.
	 * @param {number} [config.scores.badSubheadings=3] The score to return when the subheading distribution is bad.
	 * @param {number} [config.scores.badLongTextNoSubheadings=2] The score to return when the text is long and has no subheadings.
	 * @param {number} [config.applicableIfTextLongerThan=300] The minimum text length for the assessment to be applicable.
	 * @param {boolean} [config.shouldNotAppearInShortText=false] Whether the assessment should not appear in short texts.
	 * @param {boolean} [config.cornerstoneContent=false] Whether the text being analyzed is a cornerstone content.
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
			cornerstoneContent: false,
			countCharacters: false,
		};
		this.identifier = "subheadingsTooLong";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Checks if the text before the first subheading is long or very long.
	 *
	 * @param {array} foundSubheadings  An array contains found subheading objects.
	 *
	 * @returns {{isVeryLong: boolean, isLong: boolean}} An object containing an information whether the text before the first subheading is long or very long.
	 */
	checkTextBeforeFirstSubheadingLength( foundSubheadings ) {
		let textBeforeFirstSubheading = { isLong: false, isVeryLong: false };
		// There is a text if the subheading string of the first object in foundSubheadings is empty and the text is not empty.
		if ( foundSubheadings.length > 0 && foundSubheadings[ 0 ].subheading === "" && foundSubheadings[ 0 ].text !== "" ) {
			// Retrieve the length of the text before the first subheading.
			const textBeforeFirstSubheadingLength = foundSubheadings[ 0 ].countLength;
			textBeforeFirstSubheading = {
				isLong: inRange( textBeforeFirstSubheadingLength, this._config.parameters.slightlyTooMany, this._config.parameters.farTooMany ),
				isVeryLong: textBeforeFirstSubheadingLength > this._config.parameters.farTooMany,
			};
		}

		return textBeforeFirstSubheading;
	}

	/**
	 * Gets the text length from the paper. Remove unwanted element first before calculating.
	 *
	 * @param {Paper} paper The Paper object to analyse.
	 * @param {Researcher} researcher The researcher to use.
	 * @returns {number} The length of the text.
	 */
	getTextLength( paper, researcher ) {
		// Give specific feedback for cases where the post starts with a long text without subheadings.
		const customCountLength = researcher.getHelper( "customCountLength" );
		let text = paper.getText();
		text = removeHtmlBlocks( text );
		text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );

		return customCountLength ? customCountLength( text ) : getWords( text ).length;
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
		// The configuration to use for Japanese texts.
		this._config.countCharacters = !! researcher.getConfig( "countCharacters" );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setIdentifier( this.identifier );

		this._hasSubheadings = this.hasSubheadings( paper );

		this._tooLongTextsNumber = this.getTooLongSubheadingTexts().length;

		this._textLength = this.getTextLength( paper, researcher );

		// First check if there is text before the first subheading and check its length.
		// It's important that this check is done before we sort the `this._subheadingTextsLength` array.
		const textBeforeFirstSubheading = this.checkTextBeforeFirstSubheadingLength( this._subheadingTextsLength );

		this._subheadingTextsLength = this._subheadingTextsLength.sort( function( a, b ) {
			return b.countLength - a.countLength;
		} );

		const calculatedResult = this.calculateResult( textBeforeFirstSubheading );

		calculatedResult.resultTextPlural = calculatedResult.resultTextPlural || "";
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( calculatedResult.hasMarks );

		return assessmentResult;
	}

	/**
	 * Checks if there is language-specific config, and if so, overwrite the current config with it.
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
		/*
		 * If the assessment should not appear for shorter texts, only set the assessment as applicable if the text meets the minimum required length.
		 * Language-specific length requirements and methods of counting text length may apply (e.g. for Japanese, the text should be counted in
		 * characters instead of words, which also makes the minimum required length higher).
		*/
		if ( this._config.shouldNotAppearInShortText ) {
			if ( researcher.getConfig( "subheadingsTooLong" ) ) {
				this._config = this.getLanguageSpecificConfig( researcher );
			}

			const textLength = this.getTextLength( paper, researcher );

			// Do not use hasEnoughContentForAssessment as it is redundant with textLength > this._config.applicableIfTextLongerThan.
			return textLength > this._config.applicableIfTextLongerThan;
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
	 * @returns {Mark[]} All markers for the current text.
	 */
	getMarks() {
		const marks = map( this.getTooLongSubheadingTexts(), function( { subheading } ) {
			subheading = stripTags( subheading );
			const marked = marker( subheading );
			return new Mark( {
				original: subheading,
				marked: marked,
				fieldsToMark: [ "heading" ],
			} );
		} );
		// This is to ensure that an empty subheading doesn't receive marker tags.
		// If an empty subheading string receives marker tags, clicking on the eye icon next to the assessment will lead to page crashing.
		return filter( marks, ( mark ) => mark.getOriginal() !== "" );
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
	 * Returns the feedback texts for the assessment when there is a long text without subheadings.
	 *
	 * @returns {{beginning: (function(*): string), nonBeginning: (function(*): string)}}
	 */
	getFeedbackTexts() {
		return {
			beginning: useCharacter => {
				const wordFeedback = sprintf(
					/* translators: %1$s and %3$s expand to links on yoast.com, %2$s expands to the anchor end tag, %4$s expands to the recommended maximum length of a text without subheading. */
					_n(
						"%1$sSubheading distribution%2$s: The beginning of your text is longer than %4$d word and is not separated by any subheadings. %3$sAdd subheadings to improve readability.%2$s",
						"%1$sSubheading distribution%2$s: The beginning of your text is longer than %4$d words and is not separated by any subheadings. %3$sAdd subheadings to improve readability.%2$s",

						this._config.parameters.recommendedMaximumLength,
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._config.urlCallToAction,
					this._config.parameters.recommendedMaximumLength
				);
				const characterFeedback = sprintf(
					/* translators: %1$s and %3$s expand to links on yoast.com, %2$s expands to the anchor end tag, %4$s expands to the recommended maximum length of a text without subheading. */
					_n(
						"%1$sSubheading distribution%2$s: The beginning of your text is longer than %4$d character and is not separated by any subheadings. %3$sAdd subheadings to improve readability.%2$s",
						"%1$sSubheading distribution%2$s: The beginning of your text is longer than %4$d characters and is not separated by any subheadings. %3$sAdd subheadings to improve readability.%2$s",
						this._config.parameters.recommendedMaximumLength,
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._config.urlCallToAction,
					this._config.parameters.recommendedMaximumLength
				);
				return useCharacter ? characterFeedback : wordFeedback;
			},
			nonBeginning: useCharacter => {
				const wordFeedback = sprintf(
					_n(
						"%1$sSubheading distribution%2$s: %3$d section of your text is longer than the recommended number of words (%4$d) and is not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
						"%1$sSubheading distribution%2$s: %3$d sections of your text are longer than the recommended number of words (%4$d) and are not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
						this._tooLongTextsNumber,
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._tooLongTextsNumber,
					this._config.parameters.recommendedMaximumLength,
					this._config.urlCallToAction
				);
				const characterFeedback = sprintf(
					_n(
						"%1$sSubheading distribution%2$s: %3$d section of your text is longer than the recommended number of characters (%4$d) and is not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
						"%1$sSubheading distribution%2$s: %3$d sections of your text are longer than the recommended number of characters (%4$d) and are not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.",
						this._tooLongTextsNumber,
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._tooLongTextsNumber,
					this._config.parameters.recommendedMaximumLength,
					this._config.urlCallToAction
				);
				return useCharacter ? characterFeedback : wordFeedback;
			},
		};
	}

	/**
	 * Calculates the score and creates a feedback string based on the subheading texts length for a long text without subheadings.
	 *
	 * @param {Object} textBeforeFirstSubheading  An object containing information whether the text before the first subheading is long or very long.
	 * @returns {{resultText: string, score: number, hasMarks: boolean}} The calculated result.
	 */
	calculateResultForLongTextWithoutSubheadings( textBeforeFirstSubheading ) {
		const feedbackTexts = this.getFeedbackTexts();

		if ( this._hasSubheadings ) {
			if ( textBeforeFirstSubheading.isLong && this._tooLongTextsNumber < 2 ) {
				/*
				 * Orange indicator. Returns this feedback if the text preceding the first subheading is very long
				 * and the total number of too long texts is less than 2.
				 */
				return {
					score: this._config.scores.okSubheadings,
					hasMarks: false,
					resultText: feedbackTexts.beginning( this._config.countCharacters ),
				};
			}
			if ( textBeforeFirstSubheading.isVeryLong && this._tooLongTextsNumber < 2 ) {
				/*
				 * Red indicator. Returns this feedback if the text preceding the first subheading is very long
				 * and the total number of too long texts is less than 2.
				 */
				return {
					score: this._config.scores.badSubheadings,
					hasMarks: false,
					resultText: feedbackTexts.beginning( this._config.countCharacters ),
				};
			}

			const longestSubheadingTextLength = this._subheadingTextsLength[ 0 ].countLength;
			if ( longestSubheadingTextLength <= this._config.parameters.slightlyTooMany ) {
				// Green indicator.
				return {
					score: this._config.scores.goodSubheadings,
					hasMarks: false,
					resultText: sprintf(
						/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
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
					hasMarks: true,
					resultText: feedbackTexts.nonBeginning( this._config.countCharacters ),
				};
			}

			// Red indicator.
			return {
				score: this._config.scores.badSubheadings,
				hasMarks: true,
				resultText: feedbackTexts.nonBeginning( this._config.countCharacters ),
			};
		}
		// Red indicator, use '2' so we can differentiate in external analysis.
		return {
			score: this._config.scores.badLongTextNoSubheadings,
			hasMarks: false,
			resultText: sprintf(
				/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sSubheading distribution%2$s: You are not using any subheadings, although your text is rather long. %3$sTry and add some subheadings%2$s.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>",
				this._config.urlCallToAction
			),
		};
	}

	/**
	 * Calculates the score and creates a feedback string based on the subheading texts length.
	 *
	 * @param {Object} textBeforeFirstSubheading   An object containing information whether the text before the first subheading is long or very long.
	 *
	 * @returns {{resultText: string, score: number, hasMarks: boolean}} The calculated result.
	 */
	calculateResult( textBeforeFirstSubheading ) {
		if ( this._textLength > this._config.applicableIfTextLongerThan ) {
			return this.calculateResultForLongTextWithoutSubheadings( textBeforeFirstSubheading );
		}
		if ( this._hasSubheadings ) {
			// Green indicator.
			return {
				score: this._config.scores.goodSubheadings,
				hasMarks: false,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
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
			hasMarks: false,
			resultText: sprintf(
				/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
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
