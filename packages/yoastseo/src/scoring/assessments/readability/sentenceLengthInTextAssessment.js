import { map } from "lodash-es";

import Assessment from "../assessment";
import getTooLongSentences from "../../helpers/assessments/checkForTooLongSentences";
import formatNumber from "../../../helpers/formatNumber";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import addMark from "../../../markers/addMark";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { stripIncompleteTags as stripTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";

/**
 * Represents the assessment that will calculate the length of sentences in the text.
 */
class SentenceLengthInTextAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {boolean} isCornerstone	Whether the cornerstone configuration should be used.
	 * @returns {void}
	 */
	constructor( isCornerstone = false ) {
		super();

		this._isCornerstone = isCornerstone;
		this.identifier = "textSentenceLength";
	}

	/**
	 * Scores the percentage of sentences including more than the recommended number of words.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {object} i18n The object used for translations.
	 * @returns {AssessmentResult} The Assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		const sentences = researcher.getResearch( "countSentencesFromText" );
		this._config = this.getConfig( researcher );
		const percentage = this.calculatePercentage( sentences );
		const score = this.calculateScore( percentage );

		const assessmentResult = new AssessmentResult();

		assessmentResult.setScore( score );
		assessmentResult.setText( this.translateScore( score, percentage, i18n ) );
		assessmentResult.setHasMarks( ( percentage > 0 ) );

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
		return paper.hasText();
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
		this._config = this.getConfig( researcher );
		const sentenceObjects = this.getTooLongSentences( sentenceCount );

		return map( sentenceObjects, function( sentenceObject ) {
			const sentence = stripTags( sentenceObject.sentence );
			return new Mark( {
				original: sentence,
				marked: addMark( sentence ),
			} );
		} );
	}

	/**
	 * Gets the right config for the scoring criteria.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 *
	 * @returns {Object} The config that should be used.
	 */
	getConfig( researcher ) {
		let config;

		if ( this._isCornerstone === true ) {
			// If a language has specific cornerstone configuration, that configuration is used.
			const languageSpecificCornerstoneConfig = researcher.getConfig( "sentenceLengthCornerstone" );
			if ( languageSpecificCornerstoneConfig ) {
				config = languageSpecificCornerstoneConfig;
			} else {
				/*
			 * If there is no language-specific cornerstone config, but there is general sentence length config,
			 * the recommended word count from that config is used.
			 * */
				let recommendedWordCount = researcher.getConfig( "sentenceLength" ).recommendedWordCount;
				if ( ! recommendedWordCount ) {
					recommendedWordCount = 20;
				}

				config = {
					recommendedWordCount: recommendedWordCount,
					slightlyTooMany: 20,
					farTooMany: 25,
				};
			}
		} else {
			const languageSpecificConfig = researcher.getConfig( "sentenceLength" );
			const defaultConfig = {
				recommendedWordCount: 20,
				slightlyTooMany: 25,
				farTooMany: 30,
			};
			config = languageSpecificConfig ? languageSpecificConfig : defaultConfig;
		}
		return config;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} score The score.
	 * @param {number} percentage The percentage.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} A string.
	 */
	translateScore( score, percentage,  i18n ) {
		const urlTitle = createAnchorOpeningTag( "https://yoa.st/34v" );
		const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/34w" );
		if ( score >= 7 ) {
			return i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis",
					"%1$sSentence length%2$s: Great!" ),
				urlTitle,
				"</a>"
			);
		}

		return i18n.sprintf(
			/* Translators: %1$s and %6$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
			%3$d expands to percentage of sentences, %4$s expands to the recommended maximum sentence length,
			%5$s expands to the recommended maximum percentage. */
			i18n.dgettext( "js-text-analysis",
				"%1$sSentence length%2$s: %3$s of the sentences contain more than %4$s words, which is more than the recommended maximum of %5$s." +
				" %6$sTry to shorten the sentences%2$s." ),
			urlTitle,
			"</a>",
			percentage + "%",
			this._config.recommendedWordCount,
			this._config.slightlyTooMany + "%",
			urlCallToAction
		);
	}

	/**
	 * Calculates the percentage of sentences that are too long.
	 *
	 * @param {Array} sentences The sentences to calculate the percentage for.
	 * @returns {number} The calculates percentage of too long sentences.
	 */
	calculatePercentage( sentences ) {
		let percentage = 0;

		if ( sentences.length !== 0 ) {
			const tooLongTotal = this.countTooLongSentences( sentences );

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
	 * Gets the sentences that are qualified as being too long.
	 *
	 * @param {array} sentences The sentences to filter through.
	 * @returns {array} Array with all the sentences considered to be too long.
	 */
	getTooLongSentences( sentences ) {
		return getTooLongSentences( sentences, this._config.recommendedWordCount );
	}

	/**
	 * Get the total amount of sentences that are qualified as being too long.
	 *
	 * @param {Array} sentences The sentences to filter through.
	 * @returns {Number} The amount of sentences that are considered too long.
	 */
	countTooLongSentences( sentences ) {
		return this.getTooLongSentences( sentences ).length;
	}
}

export default SentenceLengthInTextAssessment;
