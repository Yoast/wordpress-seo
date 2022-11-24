import Assessor from "./assessor";
import inclusiveLanguageAssessmentsConfigs from	"./assessments/inclusiveLanguage/configuration";
import InclusiveLanguageAssessment from "./assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import { isUndefined } from "lodash-es";

/**
 * An assessor that assesses a paper for potentially non-inclusive language.
 */
class InclusiveLanguageAssessor extends Assessor {
	/**
	 * Creates a new inclusive language assessor.
	 *
	 * @param {Researcher}  	researcher 		The researcher to use.
	 * @param {Object}      	options 		The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type  = "inclusiveLanguageAssessor";
		const infoLinks = isUndefined( options ) ? {} : options.infoLinks;

		this._assessments = inclusiveLanguageAssessmentsConfigs.map(
			config => {
				// Retrieve the categories for each key in the infoLinks object (it exists in the Shopify repo).
				// If the info link category matches the config category, override the learnMoreURL of the config.
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

export default InclusiveLanguageAssessor;
