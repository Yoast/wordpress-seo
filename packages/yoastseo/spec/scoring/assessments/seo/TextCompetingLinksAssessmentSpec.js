import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import TextCompetingLinksAssessment from "../../../../src/scoring/assessments/seo/TextCompetingLinksAssessment";
import Paper from "../../../../src/values/Paper";
import buildTree from "../../../specHelpers/parse/buildTree";

const morphologyData = getMorphologyData( "en" );

describe( "An assessment for competing links in the text", function() {
	it( "returns a 'bad' score if a paper includes a link which uses the keyphrase as its anchor text", function() {
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
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: " +
			"You have a link which uses your keyphrase or synonym as its anchor text. " +
			"<a href='https://yoa.st/34m' target='_blank'>Fix that</a>!" );
	} );

	it( "returns a 'bad' score if a paper includes a link which uses the synonym as its anchor text", function() {
		const attributes = {
			keyword: "dingo",
			synonyms: "keywords",
			permalink: "http://example.org/keyword",
		};

		const paper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keyword</a>", attributes );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( paper, researcher );

		const result = new TextCompetingLinksAssessment().getResult(
			paper,
			researcher
		);

		expect( result.getScore() ).toBe( 2 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: " +
			"You have a link which uses your keyphrase or synonym as its anchor text. " +
			"<a href='https://yoa.st/34m' target='_blank'>Fix that</a>!" );
	} );

	it( "returns a good score if a paper includes a link which uses the keyphrase plus other words as its anchor text", function() {
		const attributes = {
			keyword: "keywords",
			permalink: "https://example.org/keyword",
		};

		const paper = new Paper( "hello, here is a link with my <a href='https://example.com/keyword'>keywords and baklava</a>", attributes );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( paper, researcher );

		const result = new TextCompetingLinksAssessment().getResult(
			paper,
			researcher
		);

		expect( result.score ).toBe( 8 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: " +
			"There are no links which use your keyphrase or synonym as their anchor text. Nice!" );
	} );

	it( "returns a good score if a paper includes a link whose anchor text doesn't include the keyphrase", function() {
		const attributes = {
			keyword: "keywords",
			permalink: "https://example.org/keyword",
		};

		const paper = new Paper( "hello, here is a link with my <a href='https://example.com/keyword'>baklava</a>", attributes );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( paper, researcher );

		const result = new TextCompetingLinksAssessment().getResult(
			paper,
			researcher
		);

		expect( result.score ).toBe( 8 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: " +
			"There are no links which use your keyphrase or synonym as their anchor text. Nice!" );
	} );

	it( "returns a good score when the paper is empty and no keyphrase has been set", function() {
		const paper = new Paper( "", { keyword: "" } );
		const result = new TextCompetingLinksAssessment( {} ).getResult( paper, new DefaultResearcher( paper ) );
		expect( result.score ).toBe( 8 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: " +
			"There are no links which use your keyphrase or synonym as their anchor text. Nice!" );
	} );

	it( "returns a good score when the paper is empty and there is a keyphrase", function() {
		const paper = new Paper( "", { keyword: "some keyword" } );
		const result = new TextCompetingLinksAssessment( {} ).getResult( paper, new DefaultResearcher( paper ) );
		expect( result.score ).toBe( 8 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: " +
			"There are no links which use your keyphrase or synonym as their anchor text. Nice!" );
	} );

	it( "returns a good score when the paper is empty and there is a synonym but no keyphrase", function() {
		// Note that if the keyphrase is not set, the paper is not assessed, as per getAnchorsWithKeyphrase, and a good result is expected.
		const paper = new Paper( "", { keyword: "", synonyms: "dingo" } );
		const result = new TextCompetingLinksAssessment( {} ).getResult( paper, new DefaultResearcher( paper ) );
		expect( result.score ).toBe( 8 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: " +
			"There are no links which use your keyphrase or synonym as their anchor text. Nice!" );
	} );
} );
