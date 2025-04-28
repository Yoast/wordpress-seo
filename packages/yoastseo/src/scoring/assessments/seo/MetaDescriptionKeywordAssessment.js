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
 * Assessment for checking the keyword matches in the meta description.
 */
export default class MetaDescriptionKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.scores.good] The score to return if there are enough keyword occurrences in the meta description.
	 * @param {number} [config.scores.bad] The score to return if there are no or too many keyword occurrences in the meta description.
	 * @param {string} [config.urlTitle] The URL to the relevant article on Yoast.com to add to the title of the assessment in the feedback.
	 * @param {string} [config.urlCallToAction] The URL to the relevant article on Yoast.com to add to the call to action in the assessment feedback.
	 *
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				good: 9,
				bad: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33k" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33l" ),
		};

		this.identifier = "metaDescriptionKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the metaDescriptionKeyword researcher and based on this, returns an assessment result with score.
	 *
	 * @param {Paper}      paper      The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		this._canAssess = false;

		if ( paper.hasKeyword() && paper.hasDescription() ) {
			console.log( "has keyword and description" );
			this._keyphraseCounts = researcher.getResearch( "metaDescriptionKeyword" );
			this._canAssess = true;
		}

		const assessmentResult = new AssessmentResult();
		const calculatedResult = this.calculateResult();

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		if ( assessmentResult.getScore() < 9 && this._canAssess  ) {
			assessmentResult.setHasJumps( true );
			assessmentResult.setEditFieldName( __( "meta description", "wordpress-seo" ) );
		}

		return assessmentResult;
	}

	/**
	 * Returns the result object based on the number of keyword matches in the meta description.
	 *
	 * @returns {{score: number, resultText: string}} Result object with score and text.
	 */
	calculateResult() {
		if( ! this._canAssess ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in meta description%3$s: %2$sPlease add both a keyphrase and a meta description containing the keyphrase%3$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// GOOD result when the meta description contains a keyphrase or synonym 1 or 2 times.
		if ( this._keyphraseCounts === 1 || this._keyphraseCounts === 2 ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in meta description%2$s: Keyphrase or synonym appear in the meta description. Well done!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		// BAD if the description contains every keyword term more than twice.
		if ( this._keyphraseCounts >= 3 ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/**
					 * translators:
					 * %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					 * %3$s expands to the number of sentences containing the keyphrase,
					 * %4$s expands to a link on yoast.com, %5$s expands to the anchor end tag.
					 */
					__(
						"%1$sKeyphrase in meta description%2$s: The meta description contains the keyphrase %3$s times, which is over the advised maximum of 2 times. %4$sLimit that%5$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._keyphraseCounts,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// BAD if the keyphrase is not contained in the meta description.
		return {
			score: this._config.scores.bad,
			resultText: sprintf(
				/**
				 * translators:
				 * %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag.
				 * %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag.
				 */
				__(
					"%1$sKeyphrase in meta description%2$s: The meta description has been specified, but it does not contain the keyphrase. %3$sFix that%4$s!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>",
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
