import Assessor from "./assessor";
import inclusiveLanguageAssessmentsConfigs from	"./assessments/inclusiveLanguage/configuration";
import InclusiveLanguageAssessment from "./assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import { flatten } from "lodash-es";

/**
 * An assessor that assesses a paper for potentially non-inclusive language.
 */
class InclusiveLanguageAssessor extends Assessor {
	/**
	 * Creates a new inclusive language assessor.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 * @param {Object} options The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type  = "inclusiveLanguageAssessor";
		this._assessments = [];
		inclusiveLanguageAssessmentsConfigs.forEach(
			config => {
				const infoLinks = options.infoLinks;
				// For each info link, retrieve the id.
				infoLinks.forEach( infoLink => {
					// If the info link id matches the config id, override the learnMoreURL of the config
					if ( infoLink.id === config.id ) {
						config.learnMoreUrl = infoLink.link;
					}
					this._assessments.push( new InclusiveLanguageAssessment( config ) );
				} );
			}
		);
		this._assessments = flatten( this._assessments );
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
