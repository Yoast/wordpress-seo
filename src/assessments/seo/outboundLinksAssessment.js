let AssessmentResult = require( "../../values/AssessmentResult.js" );
let Assessment = require( "../../assessment.js" );
let isEmpty = require( "lodash/isEmpty" );
let merge = require( "lodash/merge" );

/**
 * Assessment for calculating the outbound links in the text.
 */
class OutboundLinksAssessment extends Assessment {

	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
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
	 * @param {object} i18n The object used for translations
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
	 * @param {object} linkStatistics The object with all link statistics.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( linkStatistics, i18n ) {
		if ( linkStatistics.externalTotal === 0 ) {
			return i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate." );
		}

		if ( linkStatistics.externalNofollow === linkStatistics.total ) {
			/* Translators: %1$s expands the number of outbound links */
			return i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s), all nofollowed." ),
				linkStatistics.externalNofollow );
		}

		if ( linkStatistics.externalNofollow < linkStatistics.externalTotal ) {
			/* Translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
			return i18n.sprintf( i18n.dgettext(
				"js-text-analysis",
				"This page has %1$s nofollowed outbound link(s) and %2$s normal outbound link(s)."
				),
				linkStatistics.externalNofollow, linkStatistics.externalDofollow );
		}

		if ( linkStatistics.externalDofollow === linkStatistics.total ) {
			/* Translators: %1$s expands to the number of outbound links */
			return i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." ), linkStatistics.externalTotal );
		}

		return "";
	}

}

module.exports = OutboundLinksAssessment;
