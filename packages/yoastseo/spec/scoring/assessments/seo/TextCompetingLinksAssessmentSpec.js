import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import TextCompetingLinksAssessment from "../../../../src/scoring/assessments/seo/TextCompetingLinksAssessment";
import Paper from "../../../../src/values/Paper";
import buildTree from "../../../specHelpers/parse/buildTree";

const morphologyData = getMorphologyData( "en" );

describe( "An assessment for competing links in the text", function() {
	it( "returns a 'bad' score if a paper is referring to another paper with the same keyword", function() {
		const attributes = {
			keyword: "keyword",
			permalink: "http://example.org/keyword",
		};

		const paper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keywords</a>", attributes );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( paper, researcher );

		const result = new TextCompetingLinksAssessment().getResult(
			paper,
			researcher
		);

		expect( result.getScore() ).toBe( 2 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Link keyphrase</a>: " +
			"You're linking to another page with the words you want this page to rank for. " +
			"<a href='https://yoa.st/34m' target='_blank'>Don't do that</a>!" );
	} );

	it( "returns the score when the paper is empty", function() {
		const paper = new Paper( "" );
		const result = new TextCompetingLinksAssessment( {} ).getResult( paper, new DefaultResearcher( paper ) );
		expect( result.score ).toBe( 0 );
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
