let AssessmentResult = require( "../../values/AssessmentResult.js" );
let Assessment = require( "../../assessment.js" );
let merge = require( "lodash/merge" );

import Config from "../../config/config";

const maximumMetaDescriptionLength = Config.maxMeta;

/**
 * Assessment for calculating the length of the meta description.
 */
class MetaDescriptionLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			recommendedMaximumLength: 120,
			maximumLength: maximumMetaDescriptionLength,
			scores: {
				noMetaDescription: 1,
				tooLong: 6,
				tooShort: 6,
				correctLength: 9,
			},
		};

		this.identifier = "metaDescriptionLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Returns the maximum length.
	 *
	 * @returns {number} The maximum length.
	 */
	getMaximumLength() {
		return this._config.maximumLength;
	}

	/**
	 * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {object} i18n The object used for translations
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		let descriptionLength = researcher.getResearch( "metaDescriptionLength" );
		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( this.calculateScore( descriptionLength ) );
		assessmentResult.setText( this.translateScore( descriptionLength, i18n ) );

		// Max and actual are used in the snippet editor progress bar.
		assessmentResult.max = this._config.maximumLength;
		assessmentResult.actual = descriptionLength;

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
			return this._config.scores.noMetaDescription;
		}

		if ( descriptionLength <= this._config.recommendedMaximumLength ) {
			return this._config.scores.tooShort;
		}

		if ( descriptionLength > this._config.maximumLength ) {
			return this._config.scores.tooLong;
		}

		if ( descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength ) {
			return this._config.scores.correctLength;
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
		const url = "<a href='https://yoa.st/2pg' target='_blank'>";

		if ( descriptionLength === 0 ) {
			return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "No %1$smeta description%2$s has been specified. " +
				"Search engines will display copy from the page instead." ),
				url,
				"</a>"
			);
		}

		if ( descriptionLength <= this._config.recommendedMaximumLength ) {
			return i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
				%3$d expands to the number of characters in the meta description, %4$d expands to
				the total available number of characters in the meta description */
				i18n.dgettext( "js-text-analysis", "The %1$smeta description%2$s is under %3$d characters long. " +
				"However, up to %4$d characters are available." ),
				url,
				"</a>",
				this._config.recommendedMaximumLength,
				this._config.maximumLength
			);
		}

		if ( descriptionLength > this._config.maximumLength ) {
			return i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
				%3$d expands to	the total available number of characters in the meta description */
				i18n.dgettext( "js-text-analysis", "The %1$smeta description%2$s is over %3$d characters. " +
				"Reducing the length will ensure the entire description will be visible." ),
				url,
				"</a>",
				this._config.maximumLength
			);
		}

		if ( descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength ) {
			return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "The %1$smeta description%2$s has a nice length." ),
				url,
				"</a>"
			);
		}
	}
}

module.exports = MetaDescriptionLengthAssessment;
