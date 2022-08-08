import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/sesAssessments";

describe( "SES assessments", function() {
	it( "should target non-inclusive phrases",
		function() {
			const mockPaper = new Paper( "This ad is aimed at illegal immigrants" );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "illegalImmigrants" ) );

			const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
			const assessmentResult = assessor.getResult();

			expect( isApplicable ).toBeTruthy();
			expect( assessmentResult.getScore() ).toEqual( 3 );
			expect( assessmentResult.getText() ).toEqual(
				"Avoid using <i>illegal immigrants</i> as it is potentially harmful. " +
				"Consider using an alternative, such as <i>undocumented people</i>. " +
				"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
			expect( assessmentResult.hasMarks() ).toBeTruthy();
			expect( assessor.getMarks() ).toEqual( [
				{ _properties:
						{ marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at illegal immigrants</yoastmark>",
							original: "This ad is aimed at illegal immigrants",
						} } ] );
		} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at poverty stricken." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "povertyStricken" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>poverty stricken</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>people whose income is below the poverty threshold, people with low-income</i>. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(  [
			{ _properties:
					{ marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at poverty stricken.</yoastmark>",
						original: "This ad is aimed at poverty stricken.",
					} } ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high school seniors." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "welfareReliant" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
