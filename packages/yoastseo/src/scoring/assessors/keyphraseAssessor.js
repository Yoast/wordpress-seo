import Assessor from "./assessor";

import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment";
import FunctionWordsInKeyphraseAssessment from "../assessments/seo/FunctionWordsInKeyphraseAssessment";
/**
 * The Assessor class that is used for the assessments of the keyphrase.
 */
export default class KeyphraseAssessor extends Assessor {
	/**
	 * Creates a new KeyphraseAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "keyphraseAssessor";

		this._assessments = [
			new KeyphraseLengthAssessment(),
			new FunctionWordsInKeyphraseAssessment(),
		];
	}
}
