import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/otherAssessments";

describe( "Other assessments", function() {
	it( "should target non-inclusive phrases",
		function() {
			const mockPaper = new Paper( "This ad is aimed at homosexuals" );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "homosexuals" ) );

			const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
			const assessmentResult = assessor.getResult();

			expect( isApplicable ).toBeTruthy();
			expect( assessmentResult.getScore() ).toEqual( 6 );
			expect( assessmentResult.getText() ).toEqual(
				"Be careful when using <i>homosexuals</i> as it may overgeneralize or be harmful. " +
				"Instead, be specific about the group you are referring to (e.g. <i>gay men, queer people, lesbians</i>). " +
				"<a href='https://yoa.st/4ls' target='_blank'>Learn more.</a>" );
			expect( assessmentResult.hasMarks() ).toBeTruthy();
			expect( assessor.getMarks() ).toEqual( [
				{ _properties: {
					marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at homosexuals</yoastmark>",
					original: "This ad is aimed at homosexuals",
				} } ] );
		} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at minorities." );
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
		expect( assessor.getMarks() ).toEqual(  [
			{ _properties:
					{
						marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at minorities.</yoastmark>",
						original: "This ad is aimed at minorities.",
					} } ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high school seniors." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "ex-con" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at seniors who are graduating." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "felon" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at the youth" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "ex-offender" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
