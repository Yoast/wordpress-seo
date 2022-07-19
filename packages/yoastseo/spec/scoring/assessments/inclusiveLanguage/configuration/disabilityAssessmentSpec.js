import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/disabilityAssessments";
import Mark from "../../../../../src/values/Mark";

describe( "Disability assessments", function() {
	it( "should return proper feedback with two inclusive alternatives", function() {
		const mockPaper = new Paper( "Look at that sociopath." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "sociopath" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using \"sociopath\", unless talking about the specific medical condition " +
			"(in which case, use \"Person with antisocial personality disorder\"). " +
			"If you are not referencing the medical condition, consider other alternatives " +
			"to describe the trait or behavior such as \"selfish, toxic, manipulative, wild, " +
			"confusing, unpredictable, impulsive, reckless, out of control\". " +
			"<a href='https://yoa.st/' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Look at that sociopath.",
			marked: "<yoastmark class='yoast-text-mark'>Look at that sociopath.</yoastmark>",
		} ) ] );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "An alcoholic should just drink less." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "alcoholic" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using \"an alcoholic\" as it is potentially harmful. " +
			"Consider using an alternative, such as \"person with alcohol use disorder\" instead, unless referring to " +
			"someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "An alcoholic should just drink less.",
			marked: "<yoastmark class='yoast-text-mark'>An alcoholic should just drink less.</yoastmark>",
		} ) ] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "An alcoholic drink a day keeps the doctor away." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "alcoholic" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
