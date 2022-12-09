import InclusiveLanguageAssessment
	from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import Paper from "../../../../../src/values/Paper";
import Factory from "../../../../specHelpers/factory";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration";

/**
 * Tests multiple identifiers of one category. For example a singular noun and its plural forms.
 *
 * @param {Array} testDataArray The array of test data to test.
 *
 * @returns {void}
 */
export function testInclusiveLanguageAssessment( testDataArray ) {
	testDataArray.forEach( ( testData ) => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === testData.identifier ) );
		const mockPaper = new Paper( testData.text );
		const mockResearcher = Factory.buildMockResearcher( [ testData.text ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( testData.expectedScore );
		expect( assessment.getResult().text ).toBe( testData.expectedFeedback );
	} );
}
