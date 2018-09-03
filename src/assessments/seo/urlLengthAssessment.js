import { merge } from "lodash-es";

const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );

/**
 * Assessment that checks if the url is long enough.
 */
class UrlLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				tooLong: 6,
			},
		};

		this.identifier = "urlLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Checks the length of the url.
	 *
	 * @param {Paper} paper The paper to run this assessment on.
	 * @param {Researcher} researcher The researcher used for the assessment.
	 * @param {Jed} i18n The i18n-object used for parsing translations.
	 *
	 * @returns {AssessmentResult} an AssessmentResult with the score and the formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		let urlIsTooLong     = researcher.getResearch( "urlLength" );
		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( this.calculateScore( urlIsTooLong ) );
		assessmentResult.setText( this.translateScore( urlIsTooLong, i18n ) );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has a url.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasUrl();
	}

	/**
	 * Calculates the score based on the url length.
	 *
	 * @param {boolean} urlIsTooLong True when the URL is too long.
	 *
	 * @returns {number|null} The calculated score.
	 */
	calculateScore( urlIsTooLong ) {
		if ( urlIsTooLong ) {
			return this._config.scores.tooLong;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {boolean} urlIsTooLong True when the URL is too long.
	 * @param {Jed} i18n The object used for translations.
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
