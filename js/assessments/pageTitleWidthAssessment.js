var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "../helpers/inRange" ).inRangeEndInclusive;

/**
 * Returns the score and text for the pageTitleLength
 * @param {number} pageTitleLength The length of the pageTitle.
 * @param {object} i18n The i18n object used for translations.
 * @returns {object} The result object.
 */
var calculatePageTitleLengthResult = function( pageTitleLength, i18n ) {
	var minLength = 400;
	var maxLength = 600;

	if ( inRange( pageTitleLength, 1, 400 ) ) {
		return {
			score: 6,
			text: i18n.dgettext(
				"js-text-analysis",
				"The page title is too short. Use the space to add keyword variations or create compelling call-to-action copy."
			)
		};
	}

	if ( inRange( pageTitleLength, minLength, maxLength ) ) {
		return {
			score: 9,
			text: i18n.dgettext(
				"js-text-analysis",
				"The page title has a nice length."
			)
		};
	}

	if ( pageTitleLength > maxLength ) {
		return {
			score: 6,
			text: i18n.dgettext(
				"js-text-analysis",
				"The page title is wider than the viewable limit."
			)
		};
	}

	return {
		score: 1,
		text: i18n.dgettext( "js-text-analysis", "Please create a page title." )
	};
};

/**
 * Runs the pageTitleLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var titleWidthAssessment = function( paper, researcher, i18n ) {
	var pageTitleWidth = researcher.getResearch( "pageTitleWidth" );
	var pageTitleWidthResult = calculatePageTitleLengthResult( pageTitleWidth, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( pageTitleWidthResult.score );
	assessmentResult.setText( pageTitleWidthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleWidth",
	getResult: titleWidthAssessment
};

