import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/otherAssessments";
import Factory from "../../../../specHelpers/factory.js";
import Mark from "../../../../../src/values/Mark";

describe( "A test for Other assessments", function() {
	it( "should target potentially non-inclusive phrases", function() {
		const mockText = "This ad is aimed at minorities.";
		const mockPaper = new Paper( mockText );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "minorities" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>minorities</i> as it is potentially overgeneralizing. " +
			"Consider using an alternative, such as <i>marginalized groups</i>, <i>underrepresented groups</i> or specific minorities, " +
			"such as <i>gender and sexuality minorities</i>. <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: mockText,
			marked: "<yoastmark class='yoast-text-mark'>" + mockText + "</yoastmark>",
		} ) ] );
	} );

	it( "correctly identifies 'normal' which is only recognized in specific phrases", () => {
		const mockPaper = new Paper( "They are normal people." );
		const mockResearcher = Factory.buildMockResearcher( [ "They are normal people." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "normal" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>normal</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>typical</i> or a specific characteristic or experience if it is" +
			" known. <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "They are normal people.",
			marked: "<yoastmark class='yoast-text-mark'>They are normal people.</yoastmark>",
		} ) ] );
	} );
} );
