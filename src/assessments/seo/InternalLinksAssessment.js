import * as merge from "lodash/merge";

import * as Assessment from "../../assessment";
import * as AssessmentResult from "../../values/AssessmentResult";

/**
 * Assessment to check whether the text has internal links and whether they are followed or no-followed.
 */
class InternalLinksAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum number of internal links in the text.
	 * @param {number} [config.scores.allInternalFollow] The score to return if all internal links are do-follow.
	 * @param {number} [config.scores.someInternalFollow] The score to return if some but not all internal links are do-follow.
	 * @param {number} [config.scores.noneInternalFollow] The score to return if all internal links are no-follow.
	 * @param {number} [config.scores.noInternal] The score to return if there are no internal links.
	 * @param {string} [config.url] The URL to the relevant KB article.
	 *
	 * @returns {void}
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
			url: "<a href='https://yoa.st/2pm' target='_blank'>",
		};

		this.identifier = "internalLinks";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher, i18n ) {
		this.linkStatistics = researcher.getResearch( "getLinkStatistics" );
		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks if assessment is applicable to the paper.
	 *
	 * @param {Paper} paper The paper to be analyzed.
	 *
	 * @returns {boolean} Whether the paper has text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Returns a score and text based on the linkStatistics object.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} ResultObject with score and text
	 */
	calculateResult( i18n ) {
		if ( this.linkStatistics.internalTotal === 0 ) {
			return {
				score: this._config.scores.noInternal,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "No %1$sinternal links%2$s appear in this page, consider adding some as appropriate." ),
					this._config.url,
					"</a>"
				),
			};
		}

		if ( this.linkStatistics.internalNofollow === this.linkStatistics.internalTotal ) {
			return {
				score: this._config.scores.noneInternalFollow,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands the number of internal links, %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "This page has %1$s %2$sinternal link(s)%3$s, all nofollowed." ),
					this.linkStatistics.internalNofollow,
					this._config.url,
					"</a>"
				),
			};
		}

		if ( this.linkStatistics.internalDofollow === this.linkStatistics.internalTotal ) {
			return {
				score: this._config.scores.allInternalFollow,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to the number of internal links, %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "This page has %1$s %2$sinternal link(s)%3$s." ),
					this.linkStatistics.internalTotal,
					this._config.url,
					"</a>"
				),
			};
		}
		return {
			score: this._config.scores.someInternalFollow,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to the number of nofollow links, %2$s expands to a link on yoast.com,
				%3$s expands to the anchor end tag, %4$s to the number of internal links */
				i18n.dgettext(
					"js-text-analysis",
					"This page has %1$s nofollowed %2$sinternal link(s)%3$s and %4$s normal internal link(s)."
				),
				this.linkStatistics.internalNofollow,
				this._config.url,
				"</a>",
				this.linkStatistics.internalDofollow
			),
		};
	}
}

export default InternalLinksAssessment;
