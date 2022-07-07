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
			"Avoid using \"sociopath\" unless talking about the specific medical condition " +
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
} );
