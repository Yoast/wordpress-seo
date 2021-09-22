import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import TextCompetingLinksAssessment from "../../../../src/scoring/assessments/seo/TextCompetingLinksAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const i18n = Factory.buildJed();

describe( "An assessment for competing links in the text", function() {
	it( "returns a 'bad' score if a paper is referring to another paper with the same keyword", function() {
		const paper = new Paper( "This is a very interesting paper", { keyword: "some keyword" } );
		const result = new TextCompetingLinksAssessment().getResult(
			paper,
			Factory.buildMockResearcher(
				{
					total: 0,
					totalNaKeyword: 0,
					keyword: {
						totalKeyword: 1,
						matchedAnchors: [],
					},
					internalTotal: 0,
					internalDofollow: 0,
					internalNofollow: 0,
					externalTotal: 0,
					externalDofollow: 0,
					externalNofollow: 0,
					otherTotal: 0,
					otherDofollow: 0,
					otherNofollow: 0,
				}
			),
			i18n
		);

		expect( result.getScore() ).toBe( 2 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Link keyphrase</a>: " +
			"You're linking to another page with the words you want this page to rank for. " +
			"<a href='https://yoa.st/34m' target='_blank'>Don't do that</a>!" );
	} );

	it( "returns the score when the paper is empty", function() {
		const paper = new Paper( "" );
		const result = new TextCompetingLinksAssessment( {} ).getResult( paper, new DefaultResearcher( paper ), i18n );
		expect( result.score ).toBe(  0 );
	} );

	it( "is not applicable for papers without text", function() {
		const paper = new Paper( "", { keyword: "some keyword" } );
		const isApplicableResult = new TextCompetingLinksAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is not applicable for papers without keyword", function() {
		const paper = new Paper( "some text", { keyword: "" } );
		const isApplicableResult = new TextCompetingLinksAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is not applicable for papers without keyword and text", function() {
		const paper = new Paper( "", { keyword: "" } );
		const isApplicableResult = new TextCompetingLinksAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is applicable for papers with keyword and text", function() {
		const paper = new Paper( "some text", { keyword: "keyword" } );
		const isApplicableResult = new TextCompetingLinksAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );
} );
