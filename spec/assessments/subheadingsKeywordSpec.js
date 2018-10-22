import SubheadingsKeywordAssessment from "../../src/assessments/seo/subheadingsKeywordAssessment";
import Paper from "../../src/values/Paper";
import Factory from "../specHelpers/factory.js";
const i18n = Factory.buildJed();

const matchKeywordAssessment = new SubheadingsKeywordAssessment();

describe( "An assessment for matching keywords in subheadings", function() {
	it( "returns an okay score and appropriate feedback when none of the subheadings contain the keyphrase", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 1, matches: 0, percentReflectingTopic: 0 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' target='_blank'>Use more keyphrases or synonyms in your subheadings</a>!"
		);
	} );

	it( "returns a good score and appropriate feedback when one subheading containing the keyphrase.", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 4, matches: 1, percentReflectingTopic: 25 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your subheading reflects the topic of your copy. Good job!"
		);
	} );

	it( "returns a good score and appropriate feedback when more than one subheading contains the keyphrase.", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 4, matches: 2, percentReflectingTopic: 50 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: 2 (out of 4) subheadings reflect the topic of your copy. Good job!" );
	} );

	it( "checks isApplicable for a paper without text", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper without keyword", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper without subheadings", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "<p>some text</p><p>some more text</p>", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper with text and keyword", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( true );
	} );
} );
