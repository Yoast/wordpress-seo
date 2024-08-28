import { merge } from "lodash";

import Assessment from "../assessment";
import Mark from "../../../values/Mark";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";
import { collectMarkingsInSentence } from "../../../languageProcessing/helpers/word/markWordsInSentences";

/**
 * Represents the assessment that checks whether there are too many complex words in the text.
 * This assessment is not bundled in Yoast SEO.
 */
export default class WordComplexityAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 * @param {number} [config.scores.acceptableAmount] The score to return if the text has an acceptable amount of complex words.
	 * @param {number} [config.scores.goodAmount]       The score to return if the text has a good amount of complex words.
	 * @param {string} [config.urlTitle]                The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction]         The URL to the help article for this assessment.
	 * @param {function} [config.callbacks.getResultText]         The function that returns the result text.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				acceptableAmount: 6,
				goodAmount: 9,
			},
			urlTitle: "https://yoa.st/4ls",
			urlCallToAction: "https://yoa.st/4lt",
		};

		this.identifier = "wordComplexity";
		this._config = merge( defaultConfig, config );

		// Creates an anchor opening tag for the shortlinks.
		this._config.urlTitle = createAnchorOpeningTag( this._config.urlTitle );
		this._config.urlCallToAction = createAnchorOpeningTag( this._config.urlCallToAction );
	}

	/**
	 * Scores the percentage of sentences including one or more transition words.
	 *
	 * @param {Paper} paper        The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 *
	 * @returns {object} The Assessment result.
	 */
	getResult( paper, researcher ) {
		this._wordComplexity = researcher.getResearch( "wordComplexity" );

		const calculatedScore = this.calculateResult();
		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );
		assessmentResult.setHasMarks( calculatedScore.hasMarks );

		return assessmentResult;
	}

	/**
	 * Calculates word complexity word result.
	 *
	 * @returns {object} Object containing the score, the result text and the information whether there is a mark.
	 */
	calculateResult() {
		const complexWordsPercentage = this._wordComplexity.percentage;
		const hasMarks = complexWordsPercentage > 0;
		const { goodAmount, acceptableAmount } = this.getFeedbackStrings();

		if ( complexWordsPercentage < 10 ) {
			return {
				score: this._config.scores.goodAmount,
				hasMarks: hasMarks,
				resultText: goodAmount,
			};
		}
		return {
			score: this._config.scores.acceptableAmount,
			hasMarks: hasMarks,
			resultText: acceptableAmount,
		};
	}

	/**
	 * Gets the feedback strings for the word complexity assessment.
	 * Please note if you want to override the default feedback strings, you can use the `config.callbacks.getResultText` function.
	 * The callback function should return an object with the following properties:
	 * - acceptableAmount: string
	 * - goodAmount: string
	 *
	 * @returns {{acceptableAmount: string, goodAmount: string}} The feedback strings.
	 */
	getFeedbackStrings() {
		if ( ! this._config.callbacks.getResultText ) {
			return {
				acceptableAmount: "%1$sWord complexity%4$s: %2$s of the words in your text are considered complex. %3$sTry to use shorter and more familiar words to improve readability%4$s.",
				goodAmount: "%1$sWord complexity%4$s: You are not using too many complex words, which makes your text easy to read. Good job!",
			};
		}
		const complexWordsPercentage = this._wordComplexity.percentage;

		return this._config.callbacks.getResultText( {
			complexWordsPercentage,
			urlTitle: this._config.urlTitle,
			urlCallToAction: this._config.urlCallToAction,
		} );
	}

	/**
	 * Marks text for the word complexity assessment.
	 *
	 * @param {Paper}       paper       The paper to use for the marking.
	 * @param {Researcher}  researcher  The researcher containing the necessary research.
	 *
	 * @returns {Array<Mark>} A list of marks that should be applied.
	 */
	getMarks( paper, researcher ) {
		const wordComplexityResults = researcher.getResearch( "wordComplexity" ).complexWords;
		const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
		const markings = [];

		wordComplexityResults.forEach( ( result ) => {
			const complexWords = result.complexWords;
			const sentence = result.sentence;

			if ( complexWords.length > 0 ) {
				markings.push(
					new Mark( {
						original: sentence,
						marked: collectMarkingsInSentence( sentence, complexWords, matchWordCustomHelper ),
					} )
				);
			}
		} );

		return markings;
	}

	/**
	 * Checks if the word complexity assessment is applicable to the paper.
	 *
	 * @param {Paper}       paper       The paper to check.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} Returns true if the paper has text and the researcher has word complexity research.
	 */
	isApplicable( paper, researcher ) {
		return this.hasEnoughContentForAssessment( paper ) && researcher.hasResearch( "wordComplexity" );
	}
}
