import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import { createAnchorOpeningTag } from "../../../helpers";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";

/**
 * Represents the assessment that will look if the Paper contains paragraphs that are considered too long.
 */
export default class ParagraphTooLongAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 * @constructor
	 * @param {object} config       The configuration to use.
	 * @param {boolean} isProduct   Whether product configuration should be used.
	 */
	constructor( config = {}, isProduct = false ) {
		super();

		const defaultConfig = {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/35d" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/35e" ),
			countCharacters: false,
			parameters: {
				recommendedLength: 150,
				maximumRecommendedLength: 200,
			},
		};

		this.identifier = "textParagraphTooLong";
		this._config = merge( defaultConfig, config );
		this._isProduct = isProduct;
	}

	/**
	 * Returns an array containing only the paragraphs longer than the recommended length.
	 *
	 * @param {ParagraphLength[]} paragraphsLength The array containing the lengths of individual paragraphs.
	 * @param {object} config The config to use.
	 *
	 * @returns {ParagraphLength[]} An array containing too long paragraphs.
	 */
	getTooLongParagraphs( paragraphsLength, config  ) {
		return paragraphsLength.filter( paragraph => paragraph.paragraphLength > config.parameters.recommendedLength );
	}

	/**
	 * Check if there is language-specific config, and if so, overwrite the current config with it.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 *
	 * @returns {Object} The config that should be used.
	 */
	getConfig( researcher ) {
		const currentConfig = this._config;
		const languageSpecificConfig = researcher.getConfig( "paragraphLength" );

		/*
		 * If a language has a specific paragraph length config, check further if the assessment is run in product pages.
		 * If it's run in product pages, override the default config parameters with the language specific config for product pages,
		 * otherwise override it with the language specific config for default pages analysis.
		 */
		if ( languageSpecificConfig ) {
			currentConfig.parameters = this._isProduct ? languageSpecificConfig.productPageParams : languageSpecificConfig.defaultPageParams;
		}

		return currentConfig;
	}

	/**
	 * Returns the score for the ParagraphTooLongAssessment.
	 * @param {ParagraphLength[]} paragraphsLength The array containing the lengths of individual paragraphs.
	 * @param {object} config The config to use.
	 * @returns {number} The score.
	 */
	getScore( paragraphsLength, config ) {
		const sortedParagraphsLength = paragraphsLength.sort( ( a, b ) => b.paragraphLength - a.paragraphLength );

		const longestParagraphLength = sortedParagraphsLength[ 0 ].paragraphLength;
		let score;
		if ( longestParagraphLength <= config.parameters.recommendedLength ) {
			// Green indicator.
			score = 9;
		}

		if ( inRange( longestParagraphLength, config.parameters.recommendedLength, config.parameters.maximumRecommendedLength ) ) {
			// Orange indicator.
			score = 6;
		}

		if ( longestParagraphLength > config.parameters.maximumRecommendedLength ) {
			// Red indicator.
			score = 3;
		}
		return score;
	}

	/**
	 * Returns the scores and text for the ParagraphTooLongAssessment.
	 *
	 * @param {ParagraphLength[]} paragraphsLength The array containing the lengths of individual paragraphs.
	 * @param {object} config The config to use.
	 *
	 * @returns {AssessmentResult} The assessmentResult.
	 */
	calculateResult( paragraphsLength, config ) {
		const tooLongParagraphs = this.getTooLongParagraphs( paragraphsLength, config );

		const assessmentResult = new AssessmentResult();

		if ( paragraphsLength.length === 0 ) {
			return assessmentResult;
		}

		const score = this.getScore( paragraphsLength, config );

		assessmentResult.setScore( score );

		if ( score >= 7 ) {
			assessmentResult.setHasMarks( false );
			assessmentResult.setText( sprintf(
				/* translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sParagraph length%2$s: None of the paragraphs are too long. Great job!",
					"wordpress-seo"
				),
				config.urlTitle,
				"</a>"
			) );
			return assessmentResult;
		}

		const wordFeedback = sprintf(
			/* translators: %1$s and %5$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			%3$d expands to the number of paragraphs over the recommended limit, %4$d expands to the limit. */
			_n(
				"%1$sParagraph length%2$s: %3$d of the paragraphs contains more than the recommended maximum number of words (%4$d). %5$sShorten your paragraphs%2$s!",
				"%1$sParagraph length%2$s: %3$d of the paragraphs contain more than the recommended maximum number of words (%4$d). %5$sShorten your paragraphs%2$s!",
				tooLongParagraphs.length,
				"wordpress-seo"
			),
			config.urlTitle,
			"</a>",
			tooLongParagraphs.length,
			config.parameters.recommendedLength,
			config.urlCallToAction
		);

		const characterFeedback = sprintf(
			/* translators: %1$s and %5$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			%3$d expands to the number of paragraphs over the recommended limit, %4$d expands to the limit. */
			_n(
				"%1$sParagraph length%2$s: %3$d of the paragraphs contains more than the recommended maximum number of characters (%4$d). %5$sShorten your paragraphs%2$s!",
				"%1$sParagraph length%2$s: %3$d of the paragraphs contain more than the recommended maximum number of characters (%4$d). %5$sShorten your paragraphs%2$s!",
				tooLongParagraphs.length,
				"wordpress-seo"
			),
			config.urlTitle,
			"</a>",
			tooLongParagraphs.length,
			config.parameters.recommendedLength,
			config.urlCallToAction
		);
		assessmentResult.setHasMarks( true );
		assessmentResult.setText( config.countCharacters ? characterFeedback : wordFeedback );
		assessmentResult.setHasAIFixes( true );

		return assessmentResult;
	}

	/**
	 * Sort the paragraphs based on word count.
	 *
	 * @param {Array} paragraphs The array with paragraphs.
	 *
	 * @returns {Array} The array sorted on word counts.
	 */
	sortParagraphs( paragraphs ) {
		return paragraphs.sort(
			function( a, b ) {
				return b.countLength - a.countLength;
			}
		);
	}

	/**
	 * Creates a marker for the paragraphs.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {Mark[]} An array with marked paragraphs.
	 */
	getMarks( paper, researcher ) {
		const paragraphsLength = researcher.getResearch( "getParagraphLength" );
		const tooLongParagraphs = this.getTooLongParagraphs( paragraphsLength, this.getConfig( researcher ) );
		return tooLongParagraphs.flatMap( ( { paragraph } ) => {
			const scl = paragraph.sourceCodeLocation;
			return new Mark( {
				position: {
					startOffset: scl.startTag ? scl.startTag.endOffset : scl.startOffset,
					endOffset: scl.endTag ? scl.endTag.startOffset : scl.endOffset,
					startOffsetBlock: 0,
					endOffsetBlock: scl.endOffset - scl.startOffset,
					clientId: paragraph.clientId || "",
					attributeId: paragraph.attributeId || "",
					isFirstSection: paragraph.isFirstSection || false,
				},
			} );
		} );
	}

	/**
	 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
	 *
	 * @param {Paper} paper             The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		const paragraphsLength = researcher.getResearch( "getParagraphLength" );
		this._config.countCharacters = !! researcher.getConfig( "countCharacters" );

		return this.calculateResult( paragraphsLength, this.getConfig( researcher ) );
	}

	/**
	 * Checks if the paragraphTooLong assessment is applicable to the paper.
	 *
	 * @param {Paper} paper The paper to check.
	 *
	 * @returns {boolean} Returns true if the assessment is applicable to the paper.
	 */
	isApplicable( paper ) {
		return this.hasEnoughContentForAssessment( paper );
	}
}
