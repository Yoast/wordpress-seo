import FunctionWordsInKeyphraseAssessment from "../../../../src/scoring/assessments/seo/FunctionWordsInKeyphraseAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";

const i18n = Factory.buildJed();

describe( "An assessment for checking if the keyphrase contains function words only", function() {
	it( "returns a consideration feedback if there are only function words in the keyphrase", function() {
		const assessment = new FunctionWordsInKeyphraseAssessment().getResult(
			new Paper( "", { keyword: "someone was here" } ),
			Factory.buildMockResearcher( true ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/functionwordskeyphrase-1' target='_blank'>Function words in keyphrase</a>: " +
			"Your keyphrase \"someone was here\" contains function words only. " +
			"<a href='https://yoa.st/functionwordskeyphrase-2' target='_blank'>Learn more about what makes a good keyphrase.</a>"
		);
	} );

	it( "returns nothing if there are also content words in the keyphrase", function() {
		const assessment = new FunctionWordsInKeyphraseAssessment().getResult(
			new Paper( "", { keyword: "someone smart was here" } ),
			Factory.buildMockResearcher( false ),
			i18n
		);
		expect( assessment.hasScore() ).toBe( false );
	} );

	it( "does not apply if the researcher has the research but no keyword is defined", function() {
		const paper = new Paper( "some text", { keyword: "" } );
		const isApplicableResult = new FunctionWordsInKeyphraseAssessment().isApplicable( paper, new EnglishResearcher( paper ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "applies if a keyword is defined and the researcher has the research", function() {
		const paper = new Paper( "some text", { keyword: "something here" } );
		const isApplicableResult = new FunctionWordsInKeyphraseAssessment().isApplicable( paper, new EnglishResearcher( paper ) );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "does not apply if the researcher doesn't have the research", function() {
		const paper = new Paper( "some text", { keyword: "something here" } );
		const isApplicableResult = new FunctionWordsInKeyphraseAssessment().isApplicable( paper, new DefaultResearcher( paper ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "does not apply if the researcher doesn't have the research nor a keyword", function() {
		const paper = new Paper( "some text", { keyword: "" } );
		const isApplicableResult = new FunctionWordsInKeyphraseAssessment().isApplicable( paper, new DefaultResearcher( paper ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );
