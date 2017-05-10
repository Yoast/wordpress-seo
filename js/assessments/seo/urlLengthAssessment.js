let AssessmentResult = require( "../../values/AssessmentResult.js" );
let merge = require( "lodash/merge" );

let defaultConfig = {
	scoreWhenTooLong: 5,
};

class UrlLengthAssessment {

	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		this.identifier = "urlLength";
		this._config = merge( config, defaultConfig );
	}

	/**
	 * Checks the length of the url.
	 *
	 * @param {Paper} paper The paper to run this assessment on.
	 * @param {object} researcher The researcher used for the assessment.
	 * @param {object} i18n The i18n-object used for parsing translations.
	 *
	 * @returns {object} an AssessmentResult with the score and the formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		let urlIsTooLong     = researcher.getResearch( "urlLength" );
		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( this.calculateScore( urlIsTooLong ) );
		assessmentResult.setText( this.translateScore( urlIsTooLong, i18n ) );

		return assessmentResult;
	}

	/**
	 * Is this assessment applicable?
	 *
	 * @param {object} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasUrl();
	}

	/**
	 * Calculates the score based on the url length.
	 *
	 * @param {boolean} urlIsTooLong TRue when the URL is too long.
	 *
	 * @returns {number|null} The calculated score.
	 */
	calculateScore( urlIsTooLong ) {
		if ( urlIsTooLong ) {
			return this._config.scoreWhenTooLong;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {boolean} urlIsTooLong TRue when the URL is too long.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( urlIsTooLong, i18n ) {
		if ( urlIsTooLong ) {
			return i18n.dgettext( "js-text-analysis", "The slug for this page is a bit long, consider shortening it." );
		}

		return "";
	}

}

module.exports = UrlLengthAssessment;
