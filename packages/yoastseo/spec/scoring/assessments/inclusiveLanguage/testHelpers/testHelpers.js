import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/cultureAssessments";
import InclusiveLanguageAssessment
	from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import Paper from "../../../../../src/values/Paper";
import Factory from "../../../../specHelpers/factory";

/**
 * Tests multiple identifiers of one category. For example a singular noun and its plural forms.
 *
 * @param {Array} texts    The array of texts to check for each entry.
 * @param {Array} identifiers The array of identifiers.
 * @param {Array} feedbacks The array of the feedbacks for each non-inclusive phrase.
 * @param {Number} score    The expected assessment score for this category.
 * @returns {void}
 */
export function testMultipleForms( texts, identifiers, feedbacks, score ) {
	identifiers.forEach( ( identifier, i ) => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === identifier ) );
		const mockPaper = new Paper( texts[ i ] );
		const mockResearcher = Factory.buildMockResearcher( [ texts[ i ] ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( score );
		expect( assessment.getResult().text ).toBe( feedbacks[ i ] );
	} );
}
