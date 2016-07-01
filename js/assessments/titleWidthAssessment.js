var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Returns the score and text for the pageTitleLength
 * @param {number} pageTitleLength The length of the pageTitle.
 * @param {object} i18n The i18n object used for translations.
 * @returns {object} The result object.
 */
var calculatePageTitleLengthResult = function( pageTitleLength, i18n ) {
	var minLength = 35;
	var maxLength = 552;

	if ( inRange( pageTitleLength, 1, 35 ) ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of characters in the page title */
					"The page title is %1$d pixel wide.",
					"The page title is %1$d pixels wide.",
					pageTitleLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The page title contains x characters.".
					 %2$s expands to the recommended minimum number of characters for the title */
					"This is less than the recommended minimum width of %2$d pixels. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
					"This is less than the recommended minimum width of %2$d pixels. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
					minLength
				),
				pageTitleLength, minLength )
		};
	}

	if ( inRange( pageTitleLength, minLength, maxLength ) ) {
		return {
			score: 9,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of characters in the page title */
					"The page title is %1$d pixel wide.",
					"The page title is %1$d pixels wide.",
					pageTitleLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The page title contains x characters.".
					 %2$s expands to the recommended minimum number of characters for the title. The following string is
					 "and the recommended maximum of %3$d characters." */
					"This is between the recommended minimum width of %2$d pixel",
					"This is between the recommended minimum width of %2$d pixels",
					minLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding string is "This is between the recommended minimum of x characters".
					 %3$s expands to the recommended minimum number of characters for the title */
					"and the recommended maximum width of %3$d pixel.",
					"and the recommended maximum width of %3$d pixels.",
					maxLength
				),
				pageTitleLength, minLength, maxLength )
		};
	}

	if ( pageTitleLength > maxLength ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of characters in the page title */
					"The page title is %1$d pixel wide.",
					"The page title is %1$d pixels wide.",
					pageTitleLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The page title contains x characters.".
					 %2$s expands to the recommended minimum number of characters for the title. The following string is "and the
					 recommended maximum of %3$d characters." */
					"This is more than the viewable limit of %2$d pixels. Some words will not be visible to users in your listing.",
					"This is more than the viewable limit of %2$d pixels. Some words will not be visible to users in your listing.",
					maxLength
				),
				pageTitleLength, maxLength )

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

