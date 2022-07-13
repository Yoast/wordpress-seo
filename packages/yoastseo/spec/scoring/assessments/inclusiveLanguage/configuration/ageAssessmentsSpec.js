import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/ageAssessments";
import Mark from "../../../../../src/values/Mark";

describe( "Age assessments", function() {
	it( "should target non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at aging dependants" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "agingDependants" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using \"aging dependants\" as it is potentially harmful. " +
			"Consider using an alternative, such as \"older persons/older people\" instead unless referring to yourself or to " +
			"someone who explicitly wants to be referred to with this term. " +
			"Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\"). " +
			"<a href='https://yoa.st/' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "This ad is aimed at aging dependants",
			marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at aging dependants</yoastmark>",
		} ) ] );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at senior citizens. But this ad is aimed at the youth." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniorCitizens" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using \"senior citizens\" as it is potentially harmful. " +
			"Consider using an alternative, such as \"older persons/older people, older citizen(s)\" instead unless referring to yourself or to " +
			"someone who explicitly wants to be referred to with this term. " +
			"Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\"). " +
			"<a href='https://yoa.st/' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "This ad is aimed at senior citizens.",
			marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at senior citizens.</yoastmark>",
		} ) ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high school seniors." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniors" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at seniors who are graduating." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniors" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at the youth" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "seniorCitizens" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
