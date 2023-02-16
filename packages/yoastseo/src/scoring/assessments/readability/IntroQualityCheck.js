import { __, sprintf } from "@wordpress/i18n";
import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";
import { merge } from "lodash-es";
import { getSentences } from "../../../languageProcessing";
import checkForTooLongSentences from "../../helpers/assessments/checkForTooLongSentences";
import getWords from "../../../languageProcessing/helpers/word/getWords.js";
/**
 * Represents the assessment that will look if the text has a list (only applicable for product pages).
 */
export default class IntroQualityCheck extends Assessment {
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
			recommendedLength: 20,
			slightlyTooMany: 25,
			farTooMany: 30,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34v" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34w" ),
			scores: {
				good: 9,
				bad: 3,
			},
		};

		// Add cornerstone and/or product-specific config if applicable.
		this._config = merge( defaultConfig, config );

		this.identifier = "introQualityCheck";
	}

	/**
	 * Finds the first 5 sentences in a text.
	 *
	 * @param {Paper}	paper	The paper object to get the text from.
	 * @param {Researcher} 	researcher 	The researcher to use for analysis.
	 *
	 * @returns {array} An array with the first 5 sentences in a text.
	 */
	getFirstFiveSentences( paper, researcher ) {
		const text = paper.getText();
		const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );

		return getSentences( text, memoizedTokenizer ).slice( 0, 5 );
	}

	/**
	 * Checks whether first 5 sentences include sentences that are too long.
	 *
	 * @param {array}	sentences The array containing the first 5 sentences in the text.
	 *
	 * @returns {boolean}	Returns true if there is at least one sentence that is too long.
	 */
	containsTooLongSentences( sentences ) {
		console.log( sentences, "TEST4" );
		// const tooLongSentences = checkForTooLongSentences( sentences, this._config.recommendedLength );
		const sentenceLengths = sentences.map( sentence => {
			console.log( sentence, "SENTENCE1" );
			const words = getWords( sentence );
			return words.length;
		} );
		console.log( sentenceLengths, "TEST5" );
		console.log(sentenceLengths.some( number => number > this._config.recommendedLength ), "TEST8");
		// return tooLongSentences.length > 0;
		return sentenceLengths.some( number => number > this._config.recommendedLength );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher} 	researcher 	The researcher to use for analysis.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher ) {
		const firstFiveSentences = this.getFirstFiveSentences( paper, researcher );
		this.doesContainTooLongSentences = this.containsTooLongSentences( firstFiveSentences );

		const calculatedScore = this.calculateResult();

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return this.hasEnoughContentForAssessment( paper );
	}

	/**
	 * Calculate the result based whether there are too long sentences within the first 5 sentences of the text.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult() {
		// Introduction with at least one too long sentence.
		if ( this.doesContainTooLongSentences ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sIQCheck%3$s: There is at least one sentence in your introduction, which is too long. " +
						"%2$sTry to shorten your sentences%3$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Introduction which doesn't contain sentences that are too long.
		return {
			score: this._config.scores.good,
			resultText: sprintf(
				/* Translators: %1$s expands to a link on yoast.com,
				 * %2$s expands to the anchor end tag. */
				__(
					"%1$sIQCheck%2$s: The introduction of your text sounds pretty good. Excellent job!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
