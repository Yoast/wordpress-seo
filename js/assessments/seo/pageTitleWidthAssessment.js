"use strict";
let AssessmentResult = require("../../values/AssessmentResult.js");
let Assessment = require("../../assessment.js");
let inRange = require("../../helpers/inRange").inRangeEndInclusive;
let merge = require("lodash/merge");
/**
 * Represents the assessmenth that will calculate if the width of the page title is correct.
 */
class PageTitleWidthAssesment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    constructor(config = {}) {
        super();
        let defaultConfig = {
            minLength: 400,
            maxLength: 600,
            scores: {
                noTitle: 1,
                widthTooShort: 6,
                widthTooLong: 6,
                widthCorrect: 9,
            },
        };
        this.identifier = "titleWidth";
        this._config = merge(defaultConfig, config);
    }
    /**
     * Runs the pageTitleWidth module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper, researcher, i18n) {
        let pageTitleWidth = researcher.getResearch("pageTitleWidth");
        let assessmentResult = new AssessmentResult();
        assessmentResult.setScore(this.calculateScore(pageTitleWidth));
        assessmentResult.setText(this.translateScore(pageTitleWidth, i18n));
        return assessmentResult;
    }
    /**
     * Returns the score for the pageTitleWidth
     *
     * @param {number} pageTitleWidth The width of the pageTitle.
     *
     * @returns {number} The calculated score.
     */
    calculateScore(pageTitleWidth) {
        if (inRange(pageTitleWidth, 1, 400)) {
            return this._config.scores.widthTooShort;
        }
        if (inRange(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
            return this._config.scores.widthCorrect;
        }
        if (pageTitleWidth > this._config.maxLength) {
            return this._config.scores.widthTooLong;
        }
        return this._config.scores.noTitle;
    }
    /**
     * Translates the pageTitleWidth score to a message the user can understand.
     *
     * @param {number} pageTitleWidth The width of the pageTitle.
     * @param {object} i18n The object used for translations.
     *
     * @returns {string} The translated string.
     */
    translateScore(pageTitleWidth, i18n) {
        if (inRange(pageTitleWidth, 1, 400)) {
            return i18n.dgettext("js-text-analysis", "The SEO title is too short. Use the space to add keyword variations or create compelling call-to-action copy.");
        }
        if (inRange(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
            return i18n.dgettext("js-text-analysis", "The SEO title has a nice length.");
        }
        if (pageTitleWidth > this._config.maxLength) {
            return i18n.dgettext("js-text-analysis", "The SEO title is wider than the viewable limit.");
        }
        return i18n.dgettext("js-text-analysis", "Please create an SEO title.");
    }
}
module.exports = PageTitleWidthAssesment;
//# sourceMappingURL=pageTitleWidthAssessment.js.map