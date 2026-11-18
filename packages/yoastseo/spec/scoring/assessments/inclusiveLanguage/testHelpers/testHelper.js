import InclusiveLanguageAssessment
	from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import Paper from "../../../../../src/values/Paper";
import Factory from "../../../../../src/helpers/factory";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration";

/**
 * Object that contains data to test an assessment with.
 *
 * @typedef {Object} AssessmentTestData
 *
 * @property {string} identifier        The assessment's identifier.
 * @property {string} text              The paper's text to test the assessment with.
 * @property {string} expectedFeedback  The expected feedback of the assessment.
 * @property {number} expectedScore     The expected score of the assessment.
 */

/**
 * Tests ( multiple ) inclusive language assessments in one go.
 * For example for testing a targeted word/phrase and its other forms.
 *
 * @param {AssessmentTestData[]} testDataArray The array of assessment data to test.
 *
 * @returns {void}
 */
export function testInclusiveLanguageAssessments( testDataArray ) {
	testDataArray.forEach( ( testData ) => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === testData.identifier ) );
		const mockPaper = new Paper( testData.text );
		const mockResearcher = Factory.buildMockResearcher( [ testData.text ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( testData.expectedScore );
		expect( assessment.getResult().text ).toBe( testData.expectedFeedback );
	} );
}
