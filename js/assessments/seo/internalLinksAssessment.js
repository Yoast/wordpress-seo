"use strict";
var AssessmentResult = require("../../values/AssessmentResult.js");
var isEmpty = require("lodash/isEmpty");
/**
 * Returns a score and text based on the linkStatistics object.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkStatisticsResult = function (linkStatistics, i18n) {
    if (linkStatistics.internalTotal === 0) {
        return {
            score: 3,
            text: i18n.dgettext("js-text-analysis", "No internal links appear in this page, consider adding some as appropriate."),
        };
    }
    if (linkStatistics.internalNofollow === linkStatistics.total) {
        return {
            score: 7,
            /* Translators: %1$s expands the number of internal links */
            text: i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s internal link(s), all nofollowed."), linkStatistics.internalNofollow),
        };
    }
    if (linkStatistics.internalNofollow < linkStatistics.internalTotal) {
        return {
            score: 8,
            /* Translators: %1$s expands to the number of nofollow links, %2$s to the number of internal links */
            text: i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s nofollowed internal link(s) and %2$s normal internal link(s)."), linkStatistics.internalNofollow, linkStatistics.internalDofollow),
        };
    }
    if (linkStatistics.internalDofollow === linkStatistics.total) {
        return {
            score: 9,
            /* Translators: %1$s expands to the number of internal links */
            text: i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s internal link(s)."), linkStatistics.internalTotal),
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
var textHasInternalLinksAssessment = function (paper, researcher, i18n) {
    var linkStatistics = researcher.getResearch("getLinkStatistics");
    var assessmentResult = new AssessmentResult();
    if (!isEmpty(linkStatistics)) {
        var linkStatisticsResult = calculateLinkStatisticsResult(linkStatistics, i18n);
        assessmentResult.setScore(linkStatisticsResult.score);
        assessmentResult.setText(linkStatisticsResult.text);
    }
    return assessmentResult;
};
module.exports = {
    identifier: "internalLinks",
    getResult: textHasInternalLinksAssessment,
    isApplicable: function (paper) {
        return paper.hasText();
    },
};
//# sourceMappingURL=internalLinksAssessment.js.map