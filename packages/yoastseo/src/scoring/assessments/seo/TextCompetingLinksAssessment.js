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
 * Assessment to check whether there are links which use the keyphrase or its synonym as their anchor text.
 */
export default class TextCompetingLinksAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] 								The configuration to use.
	 * @param {number} [config.parameters] 						The evaluation parameters used by the assessment.
	 * @param {number} [config.parameters.recommendedMaximum] 	The recommended maximum number of links using the keyphrase as their anchor text.
	 * @param {Object} [config.scores] 							The scores to use.
	 * @param {string} [config.scores.good] 					The score to return if there are no links using the keyphrase as their anchor text.
	 * @param {string} [config.scores.bad] 						The score to return if there are links using the keyphrase as their anchor text.
	 * @param {string} [config.urlTitle] 						The URL to the relevant article on Yoast.com to add to the title of the assessment in the feedback.
	 * @param {string} [config.urlCallToAction] 				The URL to the relevant article on Yoast.com to add to the call to action in the assessment feedback.
	 *
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMaximum: 0,
			},
			scores: {
				good: 8,
				bad: 2,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34l" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34m" ),
		};

		this.identifier = "textCompetingLinks";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the linkCount module, based on this returns an assessment result with score.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 *
	 * @returns {Object} The AssessmentResult.
	 */
	getResult( paper, researcher ) {
		const assessmentResult = new AssessmentResult();

		this.totalAnchorsWithKeyphrase = researcher.getResearch( "getAnchorsWithKeyphrase" ).anchorsWithKeyphraseCount;

		const calculatedResult = this.calculateResult();

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( false );

		return assessmentResult;
	}

	/**
	 * Returns a result based on the number of links which use the keyphrase or its synonym as their anchor text.
	 *
	 * @returns {Object} ResultObject with score and text.
	 */
	calculateResult() {
		if ( this.totalAnchorsWithKeyphrase === this._config.parameters.recommendedMaximum ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					__(
						"%1$sCompeting links%2$s: There are no links which use your keyphrase or synonym as their anchor text. Nice!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		if ( this.totalAnchorsWithKeyphrase > this._config.parameters.recommendedMaximum ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators:  %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sCompeting links%3$s: You have a link which uses your keyphrase or synonym as its anchor text. %2$sFix that%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}
	}
}
