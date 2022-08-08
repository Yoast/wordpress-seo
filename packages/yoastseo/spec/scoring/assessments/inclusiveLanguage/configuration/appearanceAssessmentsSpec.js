import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/appearanceAssessments";

describe( "Age assessments", function() {
	it( "should target non-inclusive phrases",
		function() {
			const mockPaper = new Paper( "This ad is aimed at albinos" );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "albinos" ) );

			const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
			const assessmentResult = assessor.getResult();

			expect( isApplicable ).toBeTruthy();
			expect( assessmentResult.getScore() ).toEqual( 6 );
			expect( assessmentResult.getText() ).toEqual(
				"Be careful when using <i>albinos</i> as it is potentially harmful. " +
				"Consider using an alternative, such as people with albinism, albino people, " +
				"unless referring to someone who explicitly wants to be referred to with this term. " +
				"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>" );
			expect( assessmentResult.hasMarks() ).toBeTruthy();
			expect( assessor.getMarks() ).toEqual( [ { _properties:
					{ marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at albinos</yoastmark>",
						original: "This ad is aimed at albinos",
					} } ] );
		} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at obese citizens." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "obese" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>obese</i> as it is potentially harmful. " +
			"Consider using an alternative, such as " +
			"<i>has/have a higher weight, higher-weight person/people, person/people in higher weight body/bodies, heavier person/people</i>. " +
			"Alternatively, if talking about a specific person, use their preferred descriptor if known. " +
			"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [
			{ _properties: {
				marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at obese citizens.</yoastmark>",
				original: "This ad is aimed at obese citizens.",
			} } ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high vertically challenged." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "verticallyChallenged" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(  [
			{ _properties: {
				marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at high vertically challenged.</yoastmark>",
				original: "This ad is aimed at high vertically challenged." } } ] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at seniors midgets." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "midget" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at harelips" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "harelip" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
