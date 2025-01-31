import Assessor from "./assessor.js";
import inclusiveLanguageAssessmentsConfigs from "../assessments/inclusiveLanguage/configuration";
import InclusiveLanguageAssessment from "../assessments/inclusiveLanguage/InclusiveLanguageAssessment.js";

/**
 * Default options for the Inclusive language assessor.
 * The infoLinks object includes the shortlinks to be used in WordPress.
 *
 * @type {{infoLinks: {}}}
 */
const defaultOptions = {
	infoLinks: {},
};

/**
 * The InclusiveLanguageAssessor assesses a paper for potentially non-inclusive language.
 */
export default class InclusiveLanguageAssessor extends Assessor {
	/**
	 * Creates a new InclusiveLanguageAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options = {} ) {
		super( researcher, options );
		this.type  = "inclusiveLanguageAssessor";
		// Assign the options, fall back to a default value for options that are not set.
		// The "options" object will be populated with shortlinks for Shopify in the Shopify repository.
		this._options = Object.assign( {}, defaultOptions, options );

		const infoLinks = this._options.infoLinks;

		this._assessments = inclusiveLanguageAssessmentsConfigs.map(
			config => {
				// The if statement is a safety check to assure that the infoLinks object includes keys for all assessments.
				// If the category keys match the config categories, the infoLinks shortlinks are saved as the learnMoreURL of the config.
				if ( infoLinks[ config.category ] ) {
					config.learnMoreUrl = infoLinks[ config.category ];
				}
				return new InclusiveLanguageAssessment( config );
			}
		);
	}

	/**
	 * Calculates the overall score.
	 *
	 * @returns {number} The overall score.
	 */
	calculateOverallScore() {
		const results = this.getValidResults();

		const improvementResults = results.filter( result => result.getScore() === 6 );
		const problemResults = results.filter( result => result.getScore() === 3 );

		if ( problemResults.length >= 1 ) {
			return 30;
		} else if ( improvementResults.length >= 1 ) {
			return 60;
		}

		return 90;
	}
}
