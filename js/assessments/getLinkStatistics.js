var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the linkStatistics object.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkStatisticsResult = function( linkStatistics, i18n ) {
	if ( linkStatistics.total === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate." )

		};
	}
	if ( linkStatistics.externalTotal === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate." )
		};
	}
	if ( linkStatistics.totalNaKeyword > 0 ) {
		return {
			score: 2,
			text: i18n.dgettext( "js-text-analysis", "Outbound links appear in this page" )
		};
	}
	if ( linkStatistics.totalKeyword > 0 ) {
		return {
			score: 2,
			text: i18n.dgettext( "js-text-analysis", "You\'re linking to another page with the focus keyword you want this page to rank for. " +
				"Consider changing that if you truly want this page to rank." )
		};
	}
	if ( linkStatistics.externalNofollow === linkStatistics.total ) {
		return {
			score: 7,
			/* translators: %1$s expands the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s), all nofollowed." ),
				linkStatistics.externalNofollow )
		};
	}

	if ( linkStatistics.externalNofollow < linkStatistics.total ) {
		return {
			score: 8,
			/* translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s nofollowed link(s) and %2$s normal outbound link(s)." ),
				linkStatistics.externalNofollow, linkStatistics.externalDofollow )
		};
	}

	if ( linkStatistics.externalDofollow === linkStatistics.total ) {
		return {
			score: 9,
			/* translators: %1$s expands to the number of outbound links */
			text: i18n.sprint( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." ), linkStatistics.externalTotal )
		};
	}
};

/**
 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {olbject} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var getLinkStatisticsAssessment = function( paper,  researcher, i18n ) {
	var linkStatistics = researcher.getResearch( "getLinkStatistics" );
	var linkStatisticsResult = calculateLinkStatisticsResult( linkStatistics, i18n );

	return new AssessmentResult( linkStatisticsResult.score, linkStatisticsResult.text );

};

module.exports = getLinkStatisticsAssessment;
