import InclusiveLanguageAssessment from "../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../src/scoring/assessments/inclusiveLanguage/configuration/cultureAssessments";
import { values } from "yoastseo";

const { Paper } = values;

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
} );
