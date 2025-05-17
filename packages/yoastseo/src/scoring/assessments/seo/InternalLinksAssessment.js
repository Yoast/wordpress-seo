import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../languageProcessing/researches/getLinkStatistics").LinkStatistics} LinkStatistics
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Assessment to check whether the text has internal links and whether they are followed or no-followed.
 */
export default class InternalLinksAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {Object} [config.parameters] The parameters to use.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum number of internal links in the text.
	 * @param {Object} [config.scores] The scores to use.
	 * @param {number} [config.scores.allInternalFollow] The score to return if all internal links are do-follow.
	 * @param {number} [config.scores.someInternalFollow] The score to return if some but not all internal links are do-follow.
	 * @param {number} [config.scores.noneInternalFollow] The score to return if all internal links are no-follow.
	 * @param {number} [config.scores.noInternal] The score to return if there are no internal links.
	 * @param {string} [config.url] The URL to the relevant KB article.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
			},
			scores: {
				allInternalFollow: 9,
				someInternalFollow: 8,
				noneInternalFollow: 7,
				noInternal: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33z" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34a" ),
		};

		this.identifier = "internalLinks";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		this.linkStatistics = researcher.getResearch( "getLinkStatistics" );
		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult();
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Returns a score and text based on the linkStatistics object.
	 *
	 * @returns {{score: number, resultText: string}} ResultObject with score and text
	 */
	calculateResult() {
		if ( this.linkStatistics.internalTotal === 0 ) {
			return {
				score: this._config.scores.noInternal,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sInternal links%3$s: No internal links appear in this page, %2$smake sure to add some%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.linkStatistics.internalNofollow === this.linkStatistics.internalTotal ) {
			return {
				score: this._config.scores.noneInternalFollow,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sInternal links%3$s: The internal links in this page are all nofollowed. %2$sAdd some good internal links%3$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.linkStatistics.internalDofollow === this.linkStatistics.internalTotal ) {
			return {
				score: this._config.scores.allInternalFollow,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					__( "%1$sInternal links%2$s: You have enough internal links. Good job!", "wordpress-seo" ),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		return {
			score: this._config.scores.someInternalFollow,
			resultText: sprintf(
				/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sInternal links%2$s: There are both nofollowed and normal internal links on this page. Good job!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			),
		};
	}
}
