import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment";
import formatNumber from "../../../helpers/formatNumber";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";

/**
 * Represents the assessment that will calculate the length of sentences in the text.
 */
class SentenceLengthInTextAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config			The scoring configuration that should be used.
	 * @param {boolean} isCornerstone	Whether cornerstone configuration should be used.
	 * @param {boolean} isProduct		Whether product configuration should be used.

	 * @returns {void}
	 */
	constructor( config = {}, isCornerstone = false, isProduct = false ) {
		super();

		const defaultConfig = {
			recommendedLength: 20,
			slightlyTooMany: 25,
			farTooMany: 30,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34v" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34w" ),
			countCharacters: false,
		};

		// Add cornerstone and/or product-specific config if applicable.
		this._config = merge( defaultConfig, config );

		this._isCornerstone = isCornerstone;
		this._isProduct = isProduct;
		this.identifier = "textSentenceLength";
	}

	/**
	 * Scores the percentage of sentences including more than the recommended number of words.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The Assessment result.
	 */
	getResult( paper, researcher ) {
		const sentences = researcher.getResearch( "countSentencesFromText" );
		if	( researcher.getConfig( "sentenceLength" ) ) {
			this._config = this.getLanguageSpecificConfig( researcher );
		}

		this._config.countCharacters = !! researcher.getConfig( "countCharacters" );

		const percentage = this.calculatePercentage( sentences );
		const score = this.calculateScore( percentage );

		const assessmentResult = new AssessmentResult();
		if ( score < 9 ) {
			assessmentResult.setHasAIFixes( true );
		}

		assessmentResult.setScore( score );
		assessmentResult.setText( this.translateScore( score, percentage ) );
		assessmentResult.setHasMarks( percentage > 0 );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return this.hasEnoughContentForAssessment( paper );
	}

	/**
	 * Mark the sentences.
	 *
	 * @param {Paper} paper The paper to use for the marking.
	 * @param {Researcher} researcher The researcher to use.
	 *
	 * @returns {Array} Array with all the marked sentences.
	 */
	getMarks( paper, researcher ) {
		const sentenceCount = researcher.getResearch( "countSentencesFromText" );
		if ( researcher.getConfig( "sentenceLength" ) ) {
			this._config = this.getLanguageSpecificConfig( researcher );
		}
		const tooLongSentences = this.getTooLongSentences( sentenceCount );

		return tooLongSentences.map( tooLongSentence => {
			const { sentence, firstToken, lastToken } = tooLongSentence;

			const startOffset = firstToken.sourceCodeRange.startOffset;
			const endOffset = lastToken.sourceCodeRange.endOffset;

			return new Mark( {
				position: {
					startOffset,
					endOffset,
					startOffsetBlock: startOffset - ( sentence.parentStartOffset || 0 ),
					endOffsetBlock: endOffset - ( sentence.parentStartOffset || 0 ),
					clientId: sentence.parentClientId || "",
					attributeId: sentence.parentAttributeId || "",
					isFirstSection: sentence.isParentFirstSectionOfBlock || false,
				},
			} );
		} );
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
		const languageSpecificConfig = researcher.getConfig( "sentenceLength" );

		if ( languageSpecificConfig.hasOwnProperty( "recommendedLength" ) ) {
			currentConfig.recommendedLength = languageSpecificConfig.recommendedLength;
		}

		// Check if a language has specific cornerstone configuration for non-product pages.
		if ( this._isCornerstone === true && this._isProduct === false && languageSpecificConfig.hasOwnProperty( "cornerstonePercentages" ) ) {
			return merge( currentConfig, languageSpecificConfig.cornerstonePercentages );
		}
		// Check if a language has specific configuration for non-product, non-cornerstone pages.
		if ( this._isCornerstone === false && this._isProduct === false && languageSpecificConfig.hasOwnProperty( "percentages" ) ) {
			return merge( currentConfig, languageSpecificConfig.percentages );
		}
		// More conditions should be added below once we add language-specific config for product pages.
		return currentConfig;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} score The score.
	 * @param {number} percentage The percentage.
	 *
	 * @returns {string} A string.
	 */
	translateScore( score, percentage ) {
		if ( score >= 7 ) {
			return sprintf(
				/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sSentence length%2$s: Great!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			);
		}

		const wordFeedback = sprintf(
			/* translators: %1$s and %6$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			%3$s expands to percentage of sentences, %4$d expands to the recommended maximum sentence length,
			%5$s expands to the recommended maximum percentage. */
			_n(
				"%1$sSentence length%2$s: %3$s of the sentences contain more than %4$d word, which is more than the recommended maximum of %5$s. %6$sTry to shorten the sentences%2$s.",
				"%1$sSentence length%2$s: %3$s of the sentences contain more than %4$d words, which is more than the recommended maximum of %5$s. %6$sTry to shorten the sentences%2$s.",
				this._config.recommendedLength,
				"wordpress-seo"
			),
			this._config.urlTitle,
			"</a>",
			percentage + "%",
			this._config.recommendedLength,
			this._config.slightlyTooMany + "%",
			this._config.urlCallToAction
		);

		const characterFeedback = sprintf(
			/* translators: %1$s and %6$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			%3$s expands to percentage of sentences, %4$d expands to the recommended maximum sentence length,
			%5$s expands to the recommended maximum percentage. */
			_n(
				"%1$sSentence length%2$s: %3$s of the sentences contain more than %4$d character, which is more than the recommended maximum of %5$s. %6$sTry to shorten the sentences%2$s.",
				"%1$sSentence length%2$s: %3$s of the sentences contain more than %4$d characters, which is more than the recommended maximum of %5$s. %6$sTry to shorten the sentences%2$s.",
				this._config.recommendedLength,
				"wordpress-seo"
			),
			this._config.urlTitle,
			"</a>",
			percentage + "%",
			this._config.recommendedLength,
			this._config.slightlyTooMany + "%",
			this._config.urlCallToAction
		);

		return this._config.countCharacters ? characterFeedback : wordFeedback;
	}

	/**
	 * Calculates the percentage of sentences that are too long.
	 *
	 * @param {SentenceLength[]} sentences The sentences to calculate the percentage for.
	 * @returns {number} The calculates percentage of too long sentences.
	 */
	calculatePercentage( sentences ) {
		let percentage = 0;

		if ( sentences.length !== 0 ) {
			const tooLongTotal = this.getTooLongSentences( sentences ).length;

			percentage = formatNumber( ( tooLongTotal / sentences.length ) * 100 );
		}

		return percentage;
	}

	/**
	 * Calculates the score for the given percentage.
	 *
	 * @param {number} percentage The percentage to calculate the score for.
	 * @returns {number} The calculated score.
	 */
	calculateScore( percentage ) {
		let score;

		// Green indicator.
		if ( percentage <= this._config.slightlyTooMany ) {
			score = 9;
		}

		// Orange indicator.
		if ( inRange( percentage, this._config.slightlyTooMany, this._config.farTooMany ) ) {
			score = 6;
		}

		// Red indicator.
		if ( percentage > this._config.farTooMany ) {
			score = 3;
		}

		return score;
	}

	/**
	 * Returns the sentences that are qualified as being too long.
	 * @param {SentenceLength[]} sentences The sentences to filter.
	 * @returns {SentenceLength[]} Array with all the sentences considered to be too long.
	 */
	getTooLongSentences( sentences ) {
		return sentences.filter( sentence => sentence.sentenceLength > this._config.recommendedLength );
	}
}

export default SentenceLengthInTextAssessment;
