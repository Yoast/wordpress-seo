/* eslint-disable no-unused-vars */
/**
 * Represents the defaults of an assessment.
 */
class Assessment {
	/**
	 * Executes the assessment and return its result.
	 *
	 * @param {Paper}       paper       The paper to run this assessment on.
	 * @param {Researcher}  researcher  The researcher used for the assessment.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		throw "The method getResult is not implemented";
	}

	/**
	 * Checks whether the assessment is applicable
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} True.
	 */
	isApplicable( paper, researcher ) {
		return true;
	}
}

/* eslint-enable no-unused-vars */

export default Assessment;
