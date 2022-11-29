import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/ageAssessments";
import Factory from "../../../../specHelpers/factory.js";

describe( "Age assessments", function() {
	it( "should target non-inclusive phrases", function() {
		const mockText = "This ad is aimed at aging dependants";
		const mockPaper = new Paper( mockText );
		const mockResearcher = Factory.buildMockResearcher( [ mockText ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "agingDependants" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>aging dependants</i> as it is potentially harmful. Consider using an alternative," +
			" such as <i>older people</i>, unless referring to someone who explicitly wants to be referred to with this term." +
			" Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>)." +
			" <a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: mockText,
			marked: "<yoastmark class='yoast-text-mark'>" + mockText + "</yoastmark>",
		} ) ] );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at senior citizens. But this ad is aimed at the youth." );
		const mockResearcher = Factory.buildMockResearcher( [ "This ad is aimed at senior citizens.", "But this ad is aimed at the youth." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniorCitizens" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>senior citizens</i> as it is potentially harmful. Consider using an alternative," +
			" such as <i>older citizen(s)</i>, unless referring to someone who explicitly wants to be referred to with this term." +
			" Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>)." +
			" <a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "This ad is aimed at senior citizens.",
			marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at senior citizens.</yoastmark>",
		} ) ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high school seniors." );
		const mockResearcher = Factory.buildMockResearcher( [ "This ad is aimed at high school seniors." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniors" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at seniors who are graduating." );
		const mockResearcher = Factory.buildMockResearcher( [ "This ad is aimed at seniors who are graduating." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniors" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at the youth" );
		const mockResearcher = Factory.buildMockResearcher( [ "This ad is aimed at the youth" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniorCitizens" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
