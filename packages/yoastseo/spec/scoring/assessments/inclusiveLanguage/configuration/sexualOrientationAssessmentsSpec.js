import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/sexualOrientationAssessments";
import Mark from "../../../../../src/values/Mark";

describe( "A test for Sexual orientation assessments", function() {
	it( "should target potentially non-inclusive phrases", function() {
		const mockText = "This ad is aimed at homosexuals.";
		const mockPaper = new Paper( mockText );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "homosexuals" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>homosexuals</i> as it is potentially harmful. Consider using an alternative," +
			" such as <i>gay people, queer people, lesbians, gay men, people in same-gender relationships</i>, unless referring" +
			" to someone who explicitly wants to be referred to with this term. Be as specific possible and use people's preferred" +
			" labels if they are known. <a href='https://yoa.st/inclusive-language-orientation' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: mockText,
			marked: "<yoastmark class='yoast-text-mark'>" + mockText + "</yoastmark>",
		} ) ] );
	} );
} );
