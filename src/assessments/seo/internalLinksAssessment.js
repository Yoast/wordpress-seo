var AssessmentResult = require( "../../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Returns a score and text based on the linkStatistics object.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkStatisticsResult = function( linkStatistics, i18n ) {
	const url = "<a href='https://yoa.st/2pm' target='_blank'>";

	if ( linkStatistics.internalTotal === 0 ) {
		return {
			score: 3,
			text: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "No %1$sinternal links%2$s appear in this page, consider adding some as appropriate." ),
				url,
				"</a>"
			)
		};
	}

	if ( linkStatistics.internalNofollow === linkStatistics.total ) {
		return {
			score: 7,
			text: i18n.sprintf(
				/* Translators: %1$s expands the number of internal links, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "This page has %1$s %2$sinternal link(s)%3$s, all nofollowed." ),
				linkStatistics.internalNofollow,
				url,
				"</a>"
			)
		};
	}

	if ( linkStatistics.internalNofollow < linkStatistics.internalTotal ) {
		return {
			score: 8,
			text: i18n.sprintf(
				/* Translators: %1$s expands to the number of nofollow links, %2$s expands to a link on yoast.com,
				%3$s expands to the anchor end tag, %4$s to the number of internal links */
				i18n.dgettext(
				"js-text-analysis",
				"This page has %1$s nofollowed %2$sinternal link(s)%3$s and %4$s normal internal link(s)."
			),
				linkStatistics.internalNofollow,
				url,
				"</a>",
				linkStatistics.internalDofollow
			),
		};
	}

	if ( linkStatistics.internalDofollow === linkStatistics.total ) {
		return {
			score: 9,
			text: i18n.sprintf(
				/* Translators: %1$s expands to the number of internal links, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "This page has %1$s %2$sinternal link(s)%3$s." ),
				linkStatistics.internalTotal,
				url,
				"</a>"
			),
		};
	}

	return {};
};

/**
 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasInternalLinksAssessment = function( paper, researcher, i18n ) {
	var linkStatistics = researcher.getResearch( "getLinkStatistics" );
	var assessmentResult = new AssessmentResult();
	if ( ! isEmpty( linkStatistics ) ) {
		var linkStatisticsResult = calculateLinkStatisticsResult( linkStatistics, i18n );
		assessmentResult.setScore( linkStatisticsResult.score );
		assessmentResult.setText( linkStatisticsResult.text );
	}
	return assessmentResult;
};

module.exports = {
	identifier: "internalLinks",
	getResult: textHasInternalLinksAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
};
