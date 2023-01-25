/* eslint-disable no-unused-vars */

import { sanitizeString } from "../../languageProcessing";
import { isUndefined } from "lodash-es";

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

	/**
	 * Tests whether a paper object has enough content for assessments to be displayed.
	 *
	 * @param {Paper} paper 						A Paper.js object that will be tested.
	 * @param {number} contentNeededForAssessment	The minimum length in characters a text must have for assessments to be displayed.
	 *
	 * @returns {boolean} true if the text is of the required length, false otherwise.
	 */
	hasEnoughContentForAssessment( paper, contentNeededForAssessment = 50 ) {
		// The isUndefined check is necessary, because if paper is undefined .getText will throw a typeError.
		return  ! isUndefined( paper ) && sanitizeString( paper.getText() ).length >= contentNeededForAssessment;
	}
}

/* eslint-enable no-unused-vars */

export default Assessment;
