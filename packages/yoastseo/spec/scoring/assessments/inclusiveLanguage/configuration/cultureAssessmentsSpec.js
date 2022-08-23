import Mark from "../../../../../src/values/Mark";
import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/cultureAssessments";

describe( "Culture Assessments", () => {
	it( "should target only capitalized non-inclusive phrases when the caseSensitive flag is set", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorld" )  );

		const mockPaper = new Paper( "These are my First World problems." );
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
	} );
	it( "should not target non-capitalized phrases when the caseSensitive flag is set", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorld" )  );

		const mockPaper = new Paper( "This is the first world I created." );
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
	} );
	it( "should also include text title in the analysis", () => {
		const mockPaper = new Paper( "An inclusive text", { textTitle: "Spirit animal" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "spiritAnimal" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>spirit animal</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>inspiration, hero, icon, idol</i> instead, unless you are referring to the culture in which " +
			"this term originated. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Spirit animal",
			marked: "<yoastmark class='yoast-text-mark'>Spirit animal</yoastmark>",
		} ) ] );
	} );
} );
