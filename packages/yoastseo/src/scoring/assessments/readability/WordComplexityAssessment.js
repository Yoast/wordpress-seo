import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";

import { collectMarkingsInSentence } from "../../../languageProcessing/helpers/word/markWordsInSentences";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";

/**
 * Represents the assessment that checks whether there are too many complex words in the text.
 */
export default class WordComplexityAssessment extends Assessment {
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
			scores: {
				acceptableAmount: 6,
				goodAmount: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/difficult-words" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/difficult-words" ),
		};

		/*
		 * Translators: This is the name of the 'Word complexity' SEO assessment.
         * It appears before the feedback in the analysis, for example in the feedback string:
         * "Word complexity: You are not using too many complex words, which makes your text easy to read. Good job!"
         */
		this.name = __( "Word complexity", "wordpress-seo" );
		this.identifier = "wordComplexity";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Scores the percentage of sentences including one or more transition words.
	 *
	 * @param {object} paper        The paper to use for the assessment.
	 * @param {object} researcher   The researcher used for calling research.
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
	 * @returns {object} Object containing the score, the result text and the information whether there is a mark..
	 */
	calculateResult() {
		const complexWordsPercentage = this._wordComplexity.percentage;
		const hasMarks = complexWordsPercentage > 0;
		const assessmentLink = this._config.urlTitle + this.name + "</a>";

		if ( complexWordsPercentage < 5 ) {
			return {
				score: this._config.scores.goodAmount,
				hasMarks: hasMarks,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
					%3$s expands to the anchor end tag */
					__(
						// eslint-disable-next-line max-len
						"%1$s: You are not using too many complex words, which makes your text easy to read. Good job!",
						"wordpress-seo"
					),
					assessmentLink
				),
			};
		}
		return {
			score: this._config.scores.acceptableAmount,
			hasMarks: hasMarks,
			resultText: sprintf(
				/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
				%3$s expands to the anchor end tag */
				__(
					// eslint-disable-next-line max-len
					"%1$s: %2$s of the words in your text is considered complex. %3$sTry to use shorter and more familiar words to improve readability%4$s.",
					"wordpress-seo"
				),
				assessmentLink,
				complexWordsPercentage,
				this._config.urlCallToAction,
				"</a>"
			),
		};
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
		const matchWordCustomHelper = researcher.getResearch( "matchWordCustomHelper" );
		let markings = [];

		wordComplexityResults.forEach( ( result ) => {
			const complexWords = result.complexWords;
			const sentence = result.sentence;

			if ( complexWords.length > 0 ) {
				markings = markings.concat(
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
