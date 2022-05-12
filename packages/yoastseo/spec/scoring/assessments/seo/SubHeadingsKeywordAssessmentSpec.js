/* eslint-disable capitalized-comments */
import SubheadingsKeywordAssessment from "../../../../src/scoring/assessments/seo/SubHeadingsKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const matchKeywordAssessment = new SubheadingsKeywordAssessment();

describe( "An assessment for matching keywords in subheadings", () => {
	it( "returns a bad score and appropriate feedback when none of the subheadings contain the keyphrase: no matches.", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 1, matches: 0, percentReflectingTopic: 0 } )
		);

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
	} );

	it( "returns a bad score and appropriate feedback when 2 of the 8 subheadings contain the keyphrase: too few matches.", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 8, matches: 2, percentReflectingTopic: 25 } )
		);

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
	} );

	it( "returns a good score and appropriate feedback when there is exactly one subheading and " +
		"that subheading contains a match -- 1 of 1.", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 1, matches: 1, percentReflectingTopic: 100 } )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading " +
			"reflects the topic of your copy. Good job!"
		);
	} );

	it( "returns a good score and appropriate feedback when there are multiple subheadings of which one contains a match: " +
		"good number of matches (singular).", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 2, matches: 1, percentReflectingTopic: 50 } )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: 1 of your H2 and H3 subheadings " +
			"reflects the topic of your copy. Good job!"
		);
	} );

	it( "returns a good score and appropriate feedback when more than one subheading contains the keyphrase: " +
		"good number of matches (plural).", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 4, matches: 2, percentReflectingTopic: 50 } )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: 2 of your H2 and H3 subheadings " +
			"reflect the topic of your copy. Good job!"
		);
	} );

	it( "returns a bad score and appropriate feedback when more than 75% of the H2 or H3 subheadings contains the keyphrase: " +
		"too many matches.", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( { count: 8, matches: 7, percentReflectingTopic: 87.5 } )
		);

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: More than 75% of your H2 " +
			"and H3 subheadings reflect the topic of your copy. That's too much. <a href='https://yoa.st/33n' " +
			"target='_blank'>Don't over-optimize</a>!"
		);
	} );

/*	it( "returns a bad score and appropriate feedback when the subheading contains a non-exact match of a Japanese keyphrase when the keyphrase" +
		" is in double quotes.", function() {
		const mockPaper = new Paper( "<h2>小さくて可愛い花の刺繍に関する一般一般の記事です</h2>私は美しい猫を飼っています。野生のハーブの刺繡。", { keyword: "『小さい花の刺繍』" } );
		const result = matchKeywordAssessment.getResult( mockPaper, new JapaneseResearcher( mockPaper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
	} );

	it( "returns a good score and appropriate feedback when the subheading contains an exact match of a Japanese keyphrase when the keyphrase" +
		" is in double quotes.", function() {
		const mockPaper = new Paper( "<h2>小さい花の刺繍</h2>私は美しい猫を飼っています。野生のハーブの刺繡。", { keyword: "『小さい花の刺繍』" } );
		const result = matchKeywordAssessment.getResult( mockPaper, new JapaneseResearcher( mockPaper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading reflects the topic of your copy. Good job!"
		);
	} );*/

	it( "checks isApplicable for a paper without text", function() {
		const paper = new Paper( "", { keyword: "some keyword" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper without keyword", function() {
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper without subheadings", function() {
		const paper = new Paper( "<p>some text</p><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper without h2 or h3 subheadings", function() {
		const paper = new Paper( "<p>some text</p><h4>heading</h4><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper with text and keyword", function() {
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );
} );
