import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";
import { getSubheadingsTopLevel } from "../../../languageProcessing/helpers/html/getSubheadings";
import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { inRangeStartEndInclusive } from "../../helpers/assessments/inRange.js";
import AssessmentResult from "../../../values/AssessmentResult";
import removeHtmlBlocks from "../../../languageProcessing/helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../../../languageProcessing/helpers";
import getWords from "../../../languageProcessing/helpers/word/getWords";

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
export default class SubHeadingsKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				lowerBoundary: 0.3,
				recommendedMaximumLength: 300,
				upperBoundary: 0.75,
			},
			scores: {
				noKeyphraseOrText: 1,
				badLongTextNoSubheadings: 2,
				noMatches: 3,
				tooFewMatches: 3,
				goodNumberOfMatches: 9,
				goodShortTextNoSubheadings: 9,
				tooManyMatches: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33m" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33n" ),
			cornerstoneContent: false,
		};

		this.identifier = "subheadingsKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Gets the text length from the paper. Remove unwanted element first before calculating.
	 *
	 * @param {Paper} paper The Paper object to analyse.
	 * @param {Researcher} researcher The researcher to use.
	 * @returns {number} The length of the text.
	 */
	getTextLength( paper, researcher ) {
		const customCountLength = researcher.getHelper( "customCountLength" );
		let text = paper.getText();
		text = removeHtmlBlocks( text );
		text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );

		return customCountLength ? customCountLength( text ) : getWords( text ).length;
	}

	/**
	 * Runs the matchKeywordInSubheadings research and based on this returns an assessment result.
	 *
	 * @param {Paper} paper             The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		if ( researcher.getConfig( "subheadingsTooLong" ) ) {
			this._config = this.getLanguageSpecificConfig( researcher );
		}
		this._hasSubheadings = this.hasSubheadings( paper );
		this._textLength = this.getTextLength( paper, researcher );
		this._subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );

		// The configuration to use for Japanese texts.
		this._config.countCharacters = !! researcher.getConfig( "countCharacters" );

		const assessmentResult = new AssessmentResult();

		this._minNumberOfSubheadings = Math.ceil( this._subHeadings.count * this._config.parameters.lowerBoundary );
		this._maxNumberOfSubheadings = Math.floor( this._subHeadings.count * this._config.parameters.upperBoundary );
		const calculatedResult = this.calculateResult( paper );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks if there is language-specific config, and if so, overwrite the current config with it.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 *
	 * @returns {SubheadingDistributionConfig} The config that should be used.
	 */
	getLanguageSpecificConfig( researcher ) {
		const currentConfig = this._config;
		const languageSpecificConfig = researcher.getConfig( "subheadingsTooLong" );
		// Check if a language has a default cornerstone configuration.
		if ( currentConfig.cornerstoneContent === true && Object.hasOwn( languageSpecificConfig,  "cornerstoneParameters" ) ) {
			return merge( currentConfig, languageSpecificConfig.cornerstoneParameters );
		}

		// Use the default language-specific config for non-cornerstone condition.
		return merge( currentConfig, languageSpecificConfig.defaultParameters );
	}

	/**
	 * Checks whether the paper has subheadings.
	 *
	 * @param {Paper} paper The paper to use for the check.
	 *
	 * @returns {boolean} True when there is at least one subheading.
	 */
	hasSubheadings( paper ) {
		const subheadings =  getSubheadingsTopLevel( paper.getText() );
		return subheadings.length > 0;
	}

	/**
	 * Checks whether there are too few subheadings with the keyphrase.
	 *
	 * This is the case if the number of subheadings with the keyphrase is more than 0 but less than the specified
	 * recommended minimum.
	 *
	 * @returns {boolean} Returns true if the keyphrase is included in too few subheadings.
	 */
	hasTooFewMatches() {
		return this._subHeadings.matches > 0 && this._subHeadings.matches < this._minNumberOfSubheadings;
	}

	/**
	 * Checks whether there are too many subheadings with the keyphrase.
	 *
	 * The upper limit is only applicable if there is more than one subheading. If there is only one subheading with
	 * the keyphrase this would otherwise always lead to a 100% match rate.
	 *
	 * @returns {boolean} Returns true if there is more than one subheading and if the keyphrase is included in less
	 *                    subheadings than the recommended maximum.
	 */
	hasTooManyMatches() {
		return this._subHeadings.count > 1 && this._subHeadings.matches > this._maxNumberOfSubheadings;
	}

	/**
	 * Checks whether there is only one higher-level subheading and this subheading includes the keyphrase.
	 *
	 * @returns {boolean} Returns true if there is exactly one higher-level subheading and this
	 * subheading has a keyphrase match.
	 */
	isOneOfOne() {
		return this._subHeadings.count === 1 && this._subHeadings.matches === 1;
	}

	/**
	 * Checks whether there is a good number of subheadings with the keyphrase.
	 *
	 * This is the case if there is only one subheading and that subheading includes the keyphrase or if the number of
	 * subheadings with the keyphrase is within the specified recommended range.
	 *
	 * @returns {boolean} Returns true if the keyphrase is included in a sufficient number of subheadings.
	 */
	hasGoodNumberOfMatches() {
		return inRangeStartEndInclusive(
			this._subHeadings.matches,
			this._minNumberOfSubheadings,
			this._maxNumberOfSubheadings
		);
	}

	/**
	 * Determines the score and the Result text for the case there are no subheadings.
	 *
	 * @returns {{score: number, resultText: string}} The object with the calculated score and the result text.
	 */
	getResultForNoSubheadings() {
		if ( this._textLength >= this._config.parameters.recommendedMaximumLength ) {
			return {
				score: this._config.scores.badLongTextNoSubheadings,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in subheading%3$s: You are not using any higher-level subheadings containing the keyphrase or its synonyms. %2$sFix that%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}
		if ( this._textLength < this._config.parameters.recommendedMaximumLength ) {
			return {
				score: this._config.scores.goodShortTextNoSubheadings,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com and %2$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in subheading%2$s: You are not using any higher-level subheadings containing the keyphrase or its synonyms, but your text is short enough and probably doesn't need them.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
	}

	/**
	 * Determines the score and the Result text for the subheadings.
	 * @param {Paper} paper to use for the check.
	 *
	 * @returns {{score: number, resultText: string}} The object with the calculated score and the result text.
	 */
	calculateResult( paper ) {
		if ( ! paper.hasKeyword() || ! paper.hasText() ) {
			return {
				score: this._config.scores.noKeyphraseOrText,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in subheading%3$s: %2$sPlease add both a keyphrase and some text to receive relevant feedback%3$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( ! this._hasSubheadings ) {
			return this.getResultForNoSubheadings();
		}

		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scores.tooFewMatches,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in subheading%3$s: %2$sUse more keyphrases or synonyms in your H2 and H3 subheadings%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scores.tooManyMatches,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in subheading%3$s: More than 75%% of your H2 and H3 subheadings reflect the topic of your copy. That's too much. %2$sDon't over-optimize%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.isOneOfOne() ) {
			return {
				score: this._config.scores.goodNumberOfMatches,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					%3$d expands to the number of subheadings containing the keyphrase. */
					__(
						"%1$sKeyphrase in subheading%2$s: Your H2 or H3 subheading reflects the topic of your copy. Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._subHeadings.matches
				),
			};
		}

		if ( this.hasGoodNumberOfMatches() ) {
			return {
				score: this._config.scores.goodNumberOfMatches,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					%3$d expands to the number of subheadings containing the keyphrase. */
					_n(
						"%1$sKeyphrase in subheading%2$s: %3$s of your H2 and H3 subheadings reflects the topic of your copy. Good job!",
						"%1$sKeyphrase in subheading%2$s: %3$s of your H2 and H3 subheadings reflect the topic of your copy. Good job!",
						this._subHeadings.matches,
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._subHeadings.matches
				),
			};
		}

		return {
			score: this._config.scores.noMatches,
			resultText: sprintf(
				/* translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
				__(
					"%1$sKeyphrase in subheading%3$s: %2$sUse more keyphrases or synonyms in your H2 and H3 subheadings%3$s!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
