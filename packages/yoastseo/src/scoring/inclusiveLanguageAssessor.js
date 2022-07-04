import Assessor from "./assessor";
import OlderPersonAssessment from "./assessments/inclusive_language/olderPersonAssessment";

class InclusiveLanguageAssessor extends Assessor {
	constructor( researcher, options ) {
		super( researcher, options );
		this.type  = "inclusiveLanguageAssessor";
		this._assessments = [
			new OlderPersonAssessment(),
		];
	}
}

export default InclusiveLanguageAssessor;
