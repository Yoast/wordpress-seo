import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment.js";
import { createAnchorOpeningTag } from "../../../helpers";
import marker from "../../../markers/addMark.js";
import AssessmentResult from "../../../values/AssessmentResult.js";
import Mark from "../../../values/Mark.js";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Assessment to check whether a post contains more than 1 H1 heading.
 * Note that currently the assessment only flags cases with more than 1 H1 in the body because in some themes the H1 is part of the body, rather than the title.
 */
export default class SingleH1Assessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] 				The configuration to use.
	 * @param {Object} [config.scores] 			The scores to use.
	 * @param {number} [config.scores.good] 	The score to return if there are 0 or 1 H1 headings in the body text.
	 * @param {number} [config.scores.bad] 		The score to return if there are 2 or more H1 headings in the body text.
	 * @param {string} [config.urlTitle] 		The URL to the relevant article on Yoast.com to add to the title of the assessment in the feedback.
	 * @param {string} [config.urlCallToAction] The URL to the relevant article on Yoast.com to add to the call to action in the assessment feedback.
	 *
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				good: 8,
				bad: 1,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/3a6" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/3a7" ),
		};

		this.identifier = "singleH1";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the h1 research and based on this returns an assessment result with a score.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling the research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		this._h1s = researcher.getResearch( "h1s" );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult();

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		if ( calculatedResult.score === 1 ) {
			assessmentResult.setHasMarks( true );
		}

		return assessmentResult;
	}

	/**
	 * Returns the score and the feedback string for the single H1 assessment.
	 *
	 * @returns {{score: number, resultText: string}} The calculated result with a score and text.
	 */
	calculateResult() {
		if ( this._h1s.length <= 1 ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					__(
						"%1$sSingle title%2$s: You don't have multiple H1 headings, well done!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( this._h1s.length > 1 ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sSingle title%3$s: H1s should only be used as your main title. Find all H1s in your text that aren't your main title and %2$schange them to a lower heading level%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}
	}

	/**
	 * Marks all H1s in the body of the text, regardless of their position in the text.
	 *
	 * @returns {Array} Array with all the marked H1s.
	 */
	getMarks() {
		return this._h1s.map( function( h1 ) {
			return new Mark( {
				original: "<h1>" + h1.content + "</h1>",
				marked: "<h1>" + marker( h1.content ) + "</h1>",
				position: {
					startOffset: h1.position.startOffset,
					endOffset: h1.position.endOffset,
					startOffsetBlock: 0,
					endOffsetBlock: h1.position.endOffset - h1.position.startOffset,
					clientId: h1.position.clientId,
				},
			} );
		} );
	}
}
