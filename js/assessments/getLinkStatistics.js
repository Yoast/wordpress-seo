var getLinkStatistics = require( "../analyses/getLinkStatistics.js" );
var AssessmentResult = require( "../values/AssessmentResult.js" );

var calculateLinkStatisticsResult = function( linkStatistics, i18n ) {
	if ( linkStatistics.total === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate." )
		};
	}
	if ( linkStatistics.externalTotal === 0   ) {
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
			/* translators: %2$s expands the number of outbound links */
			text: i18n.dgettext( "js-text-analysis", "This page has %2$s outbound link(s), all nofollowed." )
		};
	}

	if ( linkStatistics.externalNofollow < linkStatistics.total ) {
		return {
			score: 8,
			/* translators: %2$s expands to the number of nofollow links, %3$s to the number of outbound links */
			text: i18n.dgettext( "js-text-analysis", "This page has %2$s nofollowed link(s) and %3$s normal outbound link(s)." )
		};
	}

	if ( linkStatistics.externalDofollow === linkStatistics.total ) {
		return {
			score: 9,
			/* translators: %1$s expands to the number of outbound links */
			text: i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." )
		};
	}
};

var getLinkStatisticsAssessment = function( paper, i18n ) {

	var linkStatistics = getLinkStatistics ( paper.getText(), paper.getKeyword(), paper.getUrl() );

	var linkStatisticsResult = calculateLinkStatisticsResult( linkStatistics, i18n );

	var text = i18n.sprintf( linkStatisticsResult.text, linkStatistics.externalTotal, linkStatistics.externalNofollow, linkStatistics.externalDofollow );

	return new AssessmentResult( linkStatisticsResult.score, text );

};

module.exports = getLinkStatisticsAssessment;
