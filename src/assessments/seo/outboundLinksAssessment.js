import { isEmpty } from "lodash-es";
import { merge } from "lodash-es";

import AssessmentResult from '../../values/AssessmentResult.js';
import Assessment from '../../assessment.js';

/**
 * Assessment for calculating the outbound links in the text.
 */
class OutboundLinksAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			scores: {
				noLinks: 6,
				allNofollowed: 7,
				moreNoFollowed: 8,
				allFollowed: 9,
			},
		};

		this.identifier = "externalLinks";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		let linkStatistics = researcher.getResearch( "getLinkStatistics" );
		let assessmentResult = new AssessmentResult();
		if ( ! isEmpty( linkStatistics ) ) {
			assessmentResult.setScore( this.calculateScore( linkStatistics ) );
			assessmentResult.setText( this.translateScore( linkStatistics, i18n ) );
		}
		return assessmentResult;
	}

	/**
	 * Checks whether paper has text.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
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

		if ( linkStatistics.externalNofollow === linkStatistics.total ) {
			return this._config.scores.allNofollowed;
		}

		if ( linkStatistics.externalNofollow < linkStatistics.externalTotal ) {
			return this._config.scores.moreNoFollowed;
		}

		if ( linkStatistics.externalDofollow === linkStatistics.total ) {
			return this._config.scores.allFollowed;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {Object} linkStatistics The object with all link statistics.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( linkStatistics, i18n ) {
		const url = "<a href='https://yoa.st/2pl' target='_blank'>";

		if ( linkStatistics.externalTotal === 0 ) {
			return i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "No %1$soutbound links%2$s appear in this page, consider adding some as appropriate." ),
				url,
				"</a>"
			);
		}

		if ( linkStatistics.externalNofollow === linkStatistics.total ) {
			return i18n.sprintf(
				/* Translators: %1$s expands the number of outbound links, %2$s expands to a link on yoast.com,
				%3$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "This page has %1$s %2$soutbound link(s)%3$s, all nofollowed." ),
				linkStatistics.externalNofollow,
				url,
				"</a>"
			);
		}

		if ( linkStatistics.externalNofollow < linkStatistics.externalTotal ) {
			return i18n.sprintf(
				/* Translators: %1$s expands to the number of nofollow links, %2$s expands to a link on yoast.com,
				%3$s expands to the anchor end tag, %4$s to the number of outbound links */
				i18n.dgettext( "js-text-analysis", "This page has %1$s nofollowed %2$soutbound link(s)%3$s and %4$s normal outbound link(s)." ),
				linkStatistics.externalNofollow,
				url,
				"</a>",
				linkStatistics.externalDofollow );
		}

		if ( linkStatistics.externalDofollow === linkStatistics.total ) {
			return i18n.sprintf(
				/* Translators: %1$s expands to the number of outbound links, %2$s expands to a link on yoast.com,
				%3$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "This page has %1$s %2$soutbound link(s)%3$s." ), linkStatistics.externalTotal );
		}

		return "";
	}
}

export default OutboundLinksAssessment;
