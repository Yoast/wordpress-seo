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
 * Represents the Slug keyword assessment. This assessment checks if the keyword is present in the slug.
 */
export default class SlugKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config   The configuration to use.
	 * @param {Object} [config.scores] The scores to use.
	 * @param {number} [config.scores.bad] The score to return if there is no keyphrase and/or slug.
	 * @param {number} [config.scores.okay] The score to return if not all content words are found in the slug.
	 * @param {number} [config.scores.good] The score to return if all content words are found in the slug.
	 * @param {string} [config.urlTitle] The URL to the relevant article on Yoast.com to add to the title of the assessment in the feedback.
	 * @param {string} [config.urlCallToAction] The URL to the relevant article on Yoast.com to add to the call to action in the assessment feedback.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				bad: 3,
				okay: 6,
				good: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33o" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33p" ),
		};

		this.identifier = "slugKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the Assessment and returns a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher ) {
		// Whether the paper has the data needed to return meaningful feedback (keyphrase and slug).
		this._canAssess = false;

		if ( paper.hasKeyword() && paper.hasSlug() ) {
			this._keywordInSlug = researcher.getResearch( "keywordCountInSlug" );
			this._canAssess = true;
		}

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult();
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		if ( assessmentResult.getScore() < 9 ) {
			assessmentResult.setHasJumps( true );
			if ( paper.hasKeyword() ) {
				assessmentResult.setEditFieldName( "slug" );
				assessmentResult.setEditFieldAriaLabel( __( "Edit your slug", "wordpress-seo" ) );
			} else {
				assessmentResult.setEditFieldName( "keyphrase" );
				assessmentResult.setEditFieldAriaLabel( __( "Edit your keyphrase", "wordpress-seo" ) );
			}
		}
		return assessmentResult;
	}

	/**
	 * Checks whether the assessment is applicable to the paper.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} True if the edited page is not a front page, and if the keywordCountInSlug research is available on the researcher.
	 */
	isApplicable( paper, researcher ) {
		return ! paper.isFrontPage() && researcher.hasResearch( "keywordCountInSlug" );
	}

	/**
	 * Determines the score and the result text based on whether or not there's a keyword in the slug.
	 *
	 *
	 * @returns {{score: number, resultText: string}} The object with calculated score and resultText.
	 */
	calculateResult() {
		if ( ! this._canAssess ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sKeyphrase in slug%3$s: %2$sPlease add both a keyphrase and a slug containing the keyphrase%3$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this._keywordInSlug.keyphraseLength < 3 ) {
			if ( this._keywordInSlug.percentWordMatches === 100 ) {
				return {
					score: this._config.scores.good,
					resultText: sprintf(
						/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
						__(
							"%1$sKeyphrase in slug%2$s: Great work!",
							"wordpress-seo"
						),
						this._config.urlTitle,
						"</a>"
					),
				};
			}

			return {
				score: this._config.scores.okay,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sKeyphrase in slug%3$s: (Part of) your keyphrase does not appear in the slug. %2$sChange that%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this._keywordInSlug.percentWordMatches > 50 ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					__(
						"%1$sKeyphrase in slug%2$s: More than half of your keyphrase appears in the slug. That's great!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		return {
			score: this._config.scores.okay,
			resultText: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					"%1$sKeyphrase in slug%3$s: (Part of) your keyphrase does not appear in the slug. %2$sChange that%3$s!",
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
 * This assessment checks if the keyword is present in the slug.
 * UrlKeywordAssessment was the previous name for SlugKeywordAssessment (hence the name of this file).
 * We keep (and expose) this assessment for backwards compatibility.
 *
 * @deprecated Since version 1.19.1. Use SlugKeywordAssessment instead.
 */
class UrlKeywordAssessment extends SlugKeywordAssessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config   The configuration to use.
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super( config );
		this.identifier = "urlKeyword";
		console.warn( "This object is deprecated, use SlugKeywordAssessment instead." );
	}
}

export {
	SlugKeywordAssessment,
	UrlKeywordAssessment,
};
