import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/genderAssessments";
import Mark from "../../../../../src/values/Mark";

describe( "Gender assessments", function() {
	it( "should target non-inclusive phrases", function() {
		const mockPaper = new Paper( "Mankind is so great! I could talk for hours about it." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "mankind" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>mankind</i> as it is exclusionary. Consider using an alternative, such as <i>individuals," +
			" people, persons, human beings, humanity</i>. <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Mankind is so great!",
			marked: "<yoastmark class='yoast-text-mark'>Mankind is so great!</yoastmark>",
		} ) ] );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "Look at those firemen! They're putting out the fire." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firemen" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>firemen</i> as it can be exclusionary. Unless you are sure that the group" +
			" you refer to only consists of men, use an alternative, such as <i>firefighters</i>." +
			" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Look at those firemen!",
			marked: "<yoastmark class='yoast-text-mark'>Look at those firemen!</yoastmark>",
		} ) ] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "Look at those firefighters! They're putting out the fire." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firemen" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should return proper feedback without an alternative given", function() {
		const mockPaper = new Paper( "She's acting like a shemale." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "shemale" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>shemale</i> as it is derogatory. <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "She's acting like a shemale.",
			marked: "<yoastmark class='yoast-text-mark'>She's acting like a shemale.</yoastmark>",
		} ) ] );
	} );
} );
