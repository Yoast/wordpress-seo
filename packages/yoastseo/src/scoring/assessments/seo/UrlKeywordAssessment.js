import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Represents the Slug keyword assessment. This assessment checks if the keyword is present in the slug.
 */
class SlugKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config   The configuration to use.
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
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
		this._keywordInSlug = researcher.getResearch( "keywordCountInSlug" );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult();
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has a keyword and a slug.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} True if the paper contains a keyword and a slug, and if the keywordCountInSlug research is available on the researcher.
	 */
	isApplicable( paper, researcher ) {
		return paper.hasKeyword() && paper.hasSlug() && researcher.hasResearch( "keywordCountInSlug" );
	}

	/**
	 * Determines the score and the result text based on whether or not there's a keyword in the slug.
	 *
	 *
	 * @returns {Object} The object with calculated score and resultText.
	 */
	calculateResult() {
		if ( this._keywordInSlug.keyphraseLength < 3 ) {
			if ( this._keywordInSlug.percentWordMatches === 100 ) {
				return {
					score: this._config.scores.good,
					resultText: sprintf(
						/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
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
					/* Translators:  %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
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
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
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
				/* Translators:  %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
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
 * @deprecated Since version 18.8 Use SlugKeywordAssessment instead.
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

export default SlugKeywordAssessment;
