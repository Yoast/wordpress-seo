var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns the score based on the number of subheadings found.
 * @param {number} subheadingPresence The number of subheadings found.
 * @param {object} i18n The object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateSubheadingPresenceResult = function( subheadingPresence, i18n ) {
	if( subheadingPresence > 0 ) {
		return {
			score: 9,

			// translators: %1$d expands to the number of subheadings
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					"The text contains %1$d subheading, which is great.",
					"The text contains %1$d subheadings, which is great.",
					subheadingPresence
				), subheadingPresence
			)
		};
	}

	return {
		score: 3,
		text: i18n.dgettext( "js-text-analysis", "The text does not contain any subheadings. Add at least one subheading." )
	};
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingPresence = function( paper, researcher, i18n ) {
	var subheadingPresence = researcher.getResearch( "getSubheadingPresence" );
	var result = calculateSubheadingPresenceResult( subheadingPresence, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( result.score );
	assessmentResult.setText( result.text );

	return assessmentResult;
};

module.exports = {
	getResult: getSubheadingPresence,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

