let AssessmentResult = require( "../../values/AssessmentResult.js" );
let merge = require( "lodash/merge" );

let defaultConfig = {
	recommendedValue: 120,
	maximumValue: 156,
	wrongLengthScore: 6,
};

class MetaDescriptionLengthAssessment {

	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		this.identifier = "metaDescriptionLength";
		this._config = merge( config, defaultConfig );
	}

	/**
	 * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
	 *
	 * @param {object} paper The paper to use for the assessment.
	 * @param {object} researcher The researcher used for calling research.
	 * @param {object} i18n The object used for translations
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		let descriptionLength = researcher.getResearch( "metaDescriptionLength" );
		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( this.calculateScore( descriptionLength ) );
		assessmentResult.setText( this.translateScore( descriptionLength, i18n ) );

		return assessmentResult;
	}

	/**
	 * Returns the score for the descriptionLength.
	 *
	 * @param {number} descriptionLength The length of the metadescription.
	 *
	 * @returns {number} The calculated score.
	 */
	calculateScore( descriptionLength ) {
		if ( descriptionLength === 0 ) {
			return 1;
		}

		if ( descriptionLength <= this._config.recommendedValue ) {
			return this._config.wrongLengthScore;
		}

		if ( descriptionLength > this._config.maximumValue ) {
			return this._config.wrongLengthScore;
		}

		if ( descriptionLength >= this._config.recommendedValue && descriptionLength <= this._config.maximumValue ) {
			return 9;
		}

		return 0;
	}

	/**
	 * Translates the descriptionLength to a message the user can understand.
	 *
	 * @param {number} descriptionLength The length of the metadescription.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( descriptionLength, i18n ) {
		if ( descriptionLength === 0 ) {
			return i18n.dgettext( "js-text-analysis", "No meta description has been specified. " +
				"Search engines will display copy from the page instead." );
		}

		if ( descriptionLength <= this._config.recommendedValue ) {
			return i18n.sprintf( i18n.dgettext( "js-text-analysis", "The meta description is under %1$d characters long. " +
				"However, up to %2$d characters are available." ), this._config.recommendedValue, this._config.maximumValue );
		}

		if ( descriptionLength > this._config.maximumValue ) {
			return i18n.sprintf( i18n.dgettext( "js-text-analysis", "The meta description is over %1$d characters. " +
				"Reducing the length will ensure the entire description will be visible." ), this._config.maximumValue );
		}

		if ( descriptionLength >= this._config.recommendedValue && descriptionLength <= this._config.maximumValue ) {
			return i18n.dgettext( "js-text-analysis", "The length of the meta description is sufficient." );
		}
	}

}

module.exports = MetaDescriptionLengthAssessment;
