import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Assessment to check whether the keyphrase or synonyms are encountered in the first paragraph of the article.
 */
export default class IntroductionKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {Object} [config.scores] The scores to use.
	 * @param {number} [config.scores.good] The score to return if there is a match within one sentence in the first paragraph.
	 * @param {number} [config.scores.okay] The score to return if all words are matched in the first paragraph.
	 * @param {number} [config.scores.bad] The score to return if not all words are matched in the first paragraph.
	 * @param {string} [config.urlTitle] The URL to the relevant article on Yoast.com to add to the title of the assessment in the feedback.
	 * @param {string} [config.urlCallToAction] The URL to the relevant article on Yoast.com to add to the call to action in the assessment feedback.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				good: 9,
				okay: 6,
				bad: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33e" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33f" ),
		};

		this.identifier = "introductionKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses the presence of keyphrase or synonyms in the first paragraph.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	getResult( paper, researcher ) {
		const assessmentResult = new AssessmentResult();
		// Whether the paper has the data needed to return meaningful feedback (keyphrase and text).
		this._canAssess = false;

		if ( paper.hasKeyword() && paper.hasText() ) {
			this._firstParagraphMatches = researcher.getResearch( "findKeywordInFirstParagraph" );
			this._canAssess = true;
		}
		const calculatedResult = this.calculateResult();

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		if ( calculatedResult.score < 9 && this._canAssess ) {
			assessmentResult.setHasAIFixes( true );
		}
		return assessmentResult;
	}

	/**
	 * Returns a result based on the number of occurrences of keyphrase in the first paragraph.
	 *
	 * @returns {{score: number, resultText: string}} result object with a score and translation text.
	 */
	calculateResult() {
		if ( ! this._canAssess ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in introduction%3$s: %2$sPlease add both a keyphrase and an introduction containing the keyphrase%3$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this._firstParagraphMatches.foundInOneSentence ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in introduction%2$s: Well done!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( this._firstParagraphMatches.foundInParagraph ) {
			return {
				score: this._config.scores.okay,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in introduction%3$s: Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. %2$sFix that%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
				__(
					"%1$sKeyphrase in introduction%3$s: Your keyphrase or its synonyms do not appear in the first paragraph. %2$sMake sure the topic is clear immediately%3$s.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
