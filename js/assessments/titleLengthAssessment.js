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
	var maxLength = 65;

	if ( inRange( pageTitleLength, 1, 35 ) ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of characters in the page title */
					"The page title contains %1$d character.",
					"The page title contains %1$d characters.",
					pageTitleLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The page title contains x characters.".
					%2$s expands to the recommended minimum number of characters for the title */
					"This is less than the recommended minimum of %2$d character. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
					"This is less than the recommended minimum of %2$d characters. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
					minLength
				),
				pageTitleLength, minLength )
		};
	}

	if ( inRange( pageTitleLength, 35, 66 ) ) {
		return {
			score: 9,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of characters in the page title */
					"The page title contains %1$d character.",
					"The page title contains %1$d characters.",
					pageTitleLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The page title contains x characters.".
					%2$s expands to the recommended minimum number of characters for the title. The following string is
					"and the recommended maximum of %3$d characters." */
					"This is between the recommended minimum of %2$d character",
					"This is between the recommended minimum of %2$d characters",
					minLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding string is "This is between the recommended minimum of x characters".
					%3$s expands to the recommended minimum number of characters for the title */
					"and the recommended maximum of %3$d character.",
					"and the recommended maximum of %3$d characters.",
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
					"The page title contains %1$d character.",
					"The page title contains %1$d characters.",
					pageTitleLength
				) + " " + i18n.dngettext(
					"js-text-analysis",
					/* Translators: The preceding sentence is "The page title contains x characters.".
					 %2$s expands to the recommended minimum number of characters for the title. The following string is "and the
					 recommended maximum of %3$d characters." */
					"This is more than the viewable limit of %2$d character. Some words will not be visible to users in your listing.",
					"This is more than the viewable limit of %2$d characters. Some words will not be visible to users in your listing.",
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
var titleLengthAssessment = function( paper, researcher, i18n ) {
	var pageTitleLength = researcher.getResearch( "pageTitleLength" );
	var pageTitleLengthResult = calculatePageTitleLengthResult( pageTitleLength, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( pageTitleLengthResult.score );
	assessmentResult.setText( pageTitleLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleLength",
	getResult: titleLengthAssessment
};
