import FunctionWordsInKeyphraseAssessment from "../../src/assessments/seo/FunctionWordsInKeyphraseAssessment";
import Paper from "../../src/values/Paper";
import Factory from "../specHelpers/factory";

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
			"<a href='https://yoa.st/33z' target='_blank'>Function words in keyphrase</a>: " +
			"Your keyphrase \"someone was here\" contains function words only. " +
			"<a href='https://yoa.st/34a' target='_blank'>Learn more about what makes a good keyphrase.</a>"
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


	it( "applies if no keyword is defined", function() {
		const isApplicableResult = new FunctionWordsInKeyphraseAssessment().isApplicable( new Paper( "some text" ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "does not apply if a keyword is defined", function() {
		const isApplicableResult = new FunctionWordsInKeyphraseAssessment().isApplicable( new Paper( "some text", { keyword: "something here" } ) );
		expect( isApplicableResult ).toBe( true );
	} );
} );
