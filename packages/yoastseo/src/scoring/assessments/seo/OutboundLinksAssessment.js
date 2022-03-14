import { __, sprintf } from "@wordpress/i18n";
import { isEmpty, merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment for calculating the outbound links in the text.
 */
export default class OutboundLinksAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				noLinks: 3,
				allNofollowed: 7,
				someNoFollowed: 8,
				allFollowed: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34f" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34g" ),
		};

		this.identifier = "externalLinks";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		const linkStatistics = researcher.getResearch( "getLinkStatistics" );
		const assessmentResult = new AssessmentResult();
		if ( ! isEmpty( linkStatistics ) ) {
			assessmentResult.setScore( this.calculateScore( linkStatistics ) );
			assessmentResult.setText( this.translateScore( linkStatistics ) );
		}
		return assessmentResult;
	}

	/**
	 * Checks whether paper has text.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Returns a score based on the linkStatistics object.
	 *
	 * @param {object} linkStatistics The object with all link statistics.
	 *
	 * @returns {number|null} The calculated score.
	 */
	calculateScore( linkStatistics ) {
		if ( linkStatistics.externalTotal === 0 ) {
			return this._config.scores.noLinks;
		}

		if ( linkStatistics.externalNofollow === linkStatistics.externalTotal ) {
			return this._config.scores.allNofollowed;
		}

		if ( linkStatistics.externalDofollow < linkStatistics.externalTotal ) {
			return this._config.scores.someNoFollowed;
		}

		if ( linkStatistics.externalDofollow === linkStatistics.externalTotal ) {
			return this._config.scores.allFollowed;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {Object}  linkStatistics  The object with all link statistics.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( linkStatistics ) {
		if ( linkStatistics.externalTotal === 0 ) {
			return sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					"%1$sOutbound links%3$s: No outbound links appear in this page. %2$sAdd some%3$s!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			);
		}

		if ( linkStatistics.externalNofollow === linkStatistics.externalTotal ) {
			return sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					"%1$sOutbound links%3$s: All outbound links on this page are nofollowed. %2$sAdd some normal links%3$s.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			);
		}

		if ( linkStatistics.externalDofollow === linkStatistics.externalTotal ) {
			return sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sOutbound links%2$s: Good job!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			);
		}

		if ( linkStatistics.externalDofollow < linkStatistics.externalTotal ) {
			return sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sOutbound links%2$s: There are both nofollowed and normal outbound links on this page. Good job!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			);
		}


		return "";
	}
}
