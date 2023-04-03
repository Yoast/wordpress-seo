import InclusiveLanguageAssessment from "../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../src/scoring/assessments/inclusiveLanguage/configuration/cultureAssessments";
import { values } from "yoastseo";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

const { Paper, Mark } = values;

describe( "inclusive Language Assessments", () => {
	it( "should signal it does not have enough content for assessment for short texts", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorld" ) );

		const mockPaper = new Paper( "These are my First World problems." );
		expect( assessment.hasEnoughContentForAssessment( mockPaper ) ).toBe( false );
	} );

	it( "should signal it does have enough content for assessment for longer texts", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorld" ) );

		const mockPaper = new Paper( "Alice was beginning to get very tired of sitting by her sister on the\n" +
			"bank, and of having nothing to do: once or twice she had peeped into\n" +
			"the book her sister was reading, but it had no pictures or\n" +
			"conversations in it, “and what is the use of a book,” thought Alice\n" +
			"“without pictures or conversations?”" );
		expect( assessment.hasEnoughContentForAssessment( mockPaper ) ).toBe( true );
	} );

	it( "creates the marks object for a sentence preceded by span tag", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "exotic" ) );

		const mockPaper = new Paper( "[caption id=\"attachment_1276\" align=\"alignnone\" width=\"225\"]<img class=\"size-medium wp-image-1276\" " +
			"src=\"http://basic.wordpress.test/wp-content/uploads/2023/03/Cat_November_2010-1a-225x300.jpg\" alt=\"\" />" +
			" <span style=\"font-weight: 400;\">Cats are exotic creatures. Cats are fun. Cats are adorable.</span>[/caption]" );
		const researcher = new EnglishResearcher( mockPaper );
		assessment.isApplicable( mockPaper, researcher );
		expect( assessment.getMarks() ).toEqual( [
			new Mark( {
				original: "Cats are exotic creatures.",
				marked: "<yoastmark class='yoast-text-mark'>Cats are exotic creatures.</yoastmark>",
			} ),
		] );
	} );
} );
