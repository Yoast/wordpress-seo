import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";
import getSentences from "../../../languageProcessing/helpers/sentence/getSentences";
import removeHtmlBlocks from "../../../languageProcessing/helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../../../languageProcessing/helpers";

/**
 * Represents an assessment that returns a score based on the largest percentage of text in which no keyword occurs.
 */
class KeyphraseDistributionAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.goodDistributionScore]
	 *      The average distribution score that needs to be received from the step function to get a GOOD result.
	 * @param {number} [config.parameters.acceptableDistributionScore]
	 *      The average distribution score that needs to be received from the step function to get an OKAY result.
	 * @param {number} [config.scores.good]             The score to return if keyword occurrences are evenly distributed.
	 * @param {number} [config.scores.okay]             The score to return if keyword occurrences are somewhat unevenly distributed.
	 * @param {number} [config.scores.bad]              The score to return if there is way too much text between keyword occurrences.
	 * @param {number} [config.scores.consideration]    The score to return if there are no keyword occurrences.
	 * @param {string} [config.urlTitle]                The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction]         The URL to the help article for this assessment.
	 * @param {object} [config.callbacks] 				The callbacks to use for the assessment.
	 * @param {function} [config.callbacks.getResultTexts]	The function that returns the result texts.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				goodDistributionScore: 30,
				acceptableDistributionScore: 50,
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 1,
				consideration: 0,
			},
			urlTitle: "https://yoa.st/33q",
			urlCallToAction: "https://yoa.st/33u",
			callbacks: {},
		};

		this.identifier = "keyphraseDistribution";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the keyphraseDistribution research and based on this returns an assessment result.
	 *
	 * @param {Paper}      paper      The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		this._keyphraseDistribution = researcher.getResearch( "keyphraseDistribution" );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult();

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( calculatedResult.hasMarks );
		if ( calculatedResult.score < 9 ) {
			assessmentResult.setHasAIFixes( true );
		}
		return assessmentResult;
	}

	/**
	 * Calculates the result based on the keyphraseDistribution research.
	 *
	 * @returns {Object} Object with score and feedback text.
	 */
	calculateResult() {
		const distributionScore = this._keyphraseDistribution.keyphraseDistributionScore;
		const hasMarks = this._keyphraseDistribution.sentencesToHighlight.length > 0;
		const {
			good: goodResultText,
			okay: okayResultText,
			bad: badResultText,
			consideration: considerationResultText,
		} = this.getFeedbackStrings();

		if ( distributionScore === 100 ) {
			return {
				score: this._config.scores.consideration,
				hasMarks: hasMarks,
				resultText: considerationResultText,
			};
		}

		if ( distributionScore > this._config.parameters.acceptableDistributionScore ) {
			return {
				score: this._config.scores.bad,
				hasMarks: hasMarks,
				resultText: badResultText,
			};
		}

		if ( distributionScore > this._config.parameters.goodDistributionScore &&
			distributionScore <= this._config.parameters.acceptableDistributionScore
		) {
			return {
				score: this._config.scores.okay,
				hasMarks: hasMarks,
				resultText: okayResultText,
			};
		}

		return {
			score: this._config.scores.good,
			hasMarks: hasMarks,
			resultText: goodResultText,
		};
	}

	/**
	 * Gets the feedback strings for the keyphrase distribution assessment.
	 * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
	 * The callback function should return an object with the following properties:
	 * - good: string
	 * - okay: string
	 * - bad: string
	 * - consideration: string
	 *
	 * @returns {{good: string, okay: string, bad: string, consideration: string}} The feedback strings.
	 */
	getFeedbackStrings() {
		// `urlTitleAnchorOpeningTag` represents the anchor opening tag with the URL to the article about this assessment.
		const urlTitleAnchorOpeningTag = createAnchorOpeningTag( this._config.urlTitle );
		// `urlActionAnchorOpeningTag` represents the anchor opening tag with the URL for the call to action.
		const urlActionAnchorOpeningTag = createAnchorOpeningTag( this._config.urlCallToAction );

		if ( ! this._config.callbacks.getResultTexts ) {
			const defaultResultTexts = {
				good: "%1$sKeyphrase distribution%3$s: Good job!",
				okay: "%1$sKeyphrase distribution%3$s: Uneven. Some parts of your text do not contain the keyphrase or its synonyms. %2$sDistribute them more evenly%3$s.",
				bad: "%1$sKeyphrase distribution%3$s: Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. %2$sDistribute them more evenly%3$s.",
				consideration: "%1$sKeyphrase distribution%3$s: %2$sInclude your keyphrase or its synonyms in the text so that we can check keyphrase distribution%3$s.",
			};
			return mapValues(
				defaultResultTexts,
				( resultText ) => this.formatResultText( resultText, urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag )
			);
		}

		return this._config.callbacks.getResultTexts( { urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag } );
	}

	/**
	 * Creates a marker for all content words in keyphrase and synonyms.
	 *
	 * @returns {Array} All markers for the current text.
	 */
	getMarks() {
		return this._keyphraseDistribution.sentencesToHighlight;
	}

	/**
	 * Checks whether the paper has a text with at least 15 sentences and a keyword,
	 * and whether the researcher has keyphraseDistribution research.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean}   Returns true when there is a keyword and a text with 15 sentences or more
	 *                      and the researcher has keyphraseDistribution research.
	 */
	isApplicable( paper, researcher ) {
		const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
		let text = paper.getText();
		text = removeHtmlBlocks( text );
		text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );
		const sentences = getSentences( text, memoizedTokenizer );

		return paper.hasText() && paper.hasKeyword() && sentences.length >= 15 && researcher.hasResearch( "keyphraseDistribution" );
	}
}

export default KeyphraseDistributionAssessment;
