import Assessor from "./assessor";
import inclusiveLanguageAssessmentsConfigs from	"./assessments/inclusiveLanguage/configuration";
import InclusiveLanguageAssessment from "./assessments/inclusiveLanguage/InclusiveLanguageAssessment";

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
		this._assessments = inclusiveLanguageAssessmentsConfigs.map(
			config => new InclusiveLanguageAssessment( config )
		);
	}
}

export default InclusiveLanguageAssessor;
