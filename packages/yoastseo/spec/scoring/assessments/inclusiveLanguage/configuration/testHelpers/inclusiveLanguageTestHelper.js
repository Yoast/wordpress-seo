import Paper from "../../../../../../src/values/Paper";
import InclusiveLanguageAssessment from "../../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import Factory from "../../../../../specHelpers/factory.js";

/**
 * As.
 * @param {object} assessments A
 * @param {string} testSentence A
 * @param {object} assessmentIdentifier A
 * @param {boolean} expectedApplicable A
 * @param {number} [expectedScore] A
 * @param {string} [expectedFeedback] A
 * @param {object} [expectedMarks] A
 * @returns {null} Has no return value.
 */
export const inclusiveLanguageAssessmentTestHelper = function(
	assessments, mocktext, mockSentences, assessmentIdentifier, expectedApplicable, expectedScore, expectedFeedback, expectedMarks ) {
	const mockPaper = new Paper( mocktext );
	const mockResearcher = Factory.buildMockResearcher( mockSentences );
	const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === assessmentIdentifier ) );
	const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );


	if ( expectedApplicable ) {
		expect( isApplicable ).toBeTruthy();

		const assessmentResult = assessor.getResult();

		expect( assessmentResult.getScore() ).toEqual( expectedScore );
		expect( assessmentResult.getText() ).toEqual( expectedFeedback );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( expectedMarks );
	} else {
		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	}
};
