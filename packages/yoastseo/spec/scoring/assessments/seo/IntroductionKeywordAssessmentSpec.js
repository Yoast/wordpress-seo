import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import IntroductionKeywordAssessment from "../../../../src/scoring/assessments/seo/IntroductionKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../../src/helpers/factory";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import buildTree from "../../../specHelpers/parse/buildTree";

const morphologyData = getMorphologyData( "en" );

describe( "An assessment for finding the keyword in the first paragraph", function() {
	it( "returns keyphrase words found in one sentence of the first paragraph", function() {
		const paper = new Paper( "some text with some keyword",
			{ keyword: "some keywords", synonyms: "", locale: "en_EN" } );
		const researcher = Factory.buildMockResearcher( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "returns synonym words found in one sentence of the first paragraph", function() {
		const paper = new Paper( "some text with some keywords",
			{ keyword: "something", synonyms: "some keyword", locale: "en_EN" } );
		const researcher = Factory.buildMockResearcher( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "returns keyphrase words found within the first paragraph, but not in one sentence", function() {
		const paper = new Paper( "Some text with some keyword. A keyphrase comes here.",
			{ keyword: "keyword and keyphrases", synonyms: "", locale: "en_EN" } );
		const researcher = Factory.buildMockResearcher( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence." +
			" <a href='https://yoa.st/33f' target='_blank'>Fix that</a>!" );
	} );

	it( "returns synonym words found within the first paragraph, but not in one sentence", function() {
		const paper = new Paper( "Some text with some keyword. A keyphrase comes here.",
			{ keyword: "unrelated keyword", synonyms: "keyword and keyphrases", locale: "en_EN" } );
		const researcher = Factory.buildMockResearcher( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence." +
			" <a href='https://yoa.st/33f' target='_blank'>Fix that</a>!" );
	} );

	it( "returns keyphrase words not found within the first paragraph", function() {
		const paper = new Paper( "Some text with some keyword. A keyphrase comes here.",
			{ keyword: "ponies", synonyms: "doggies" } );
		const researcher = Factory.buildMockResearcher( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' target='_blank'>Make sure" +
			" the topic is clear immediately</a>." );
	} );

	it( "returns feedback when there is no keyphrase and no text", function() {
		const paper = new Paper( "" );
		const researcher = Factory.buildMockResearcher( {} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" <a href='https://yoa.st/33f' target='_blank'>Please add both a keyphrase and an introduction containing the keyphrase</a>." );
	} );

	it( "returns feedback when no keyphrase is set", function() {
		const paper = new Paper( "Some text with some keyword. A keyphrase comes here." );
		const researcher = Factory.buildMockResearcher( {} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" <a href='https://yoa.st/33f' target='_blank'>Please add both a keyphrase and an introduction containing the keyphrase</a>." );
	} );

	it( "returns feedback when there is no text", function() {
		const paper = new Paper( "", { keyword: "ponies" } );
		const researcher = Factory.buildMockResearcher( {} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" <a href='https://yoa.st/33f' target='_blank'>Please add both a keyphrase and an introduction containing the keyphrase</a>." );
	} );

	it( "returns `hasAIFixes` to be true when the result is BAD and the paper has text and a keyphrase", function() {
		const paper = new Paper( "Some text with some keyword. A keyphrase comes here.",
			{ keyword: "ponies", synonyms: "doggies" } );
		const researcher = Factory.buildMockResearcher( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.hasAIFixes() ).toBeTruthy();
	} );

	it( "returns `hasAIFixes` to be false when the result is BAD and the paper doesn't have text or a keyphrase", function() {
		const paper = new Paper( "" );
		const researcher = Factory.buildMockResearcher( {} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.hasAIFixes() ).toBeFalsy();
	} );

	it( "returns `hasAIFixes` to be false when the result is BAD and the paper doesn't have text", function() {
		const paper = new Paper( "", { keyword: "ponies" } );
		const researcher = Factory.buildMockResearcher( {} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.hasAIFixes() ).toBeFalsy();
	} );

	it( "returns `hasAIFixes` to be false when the result is BAD and the paper doesn't have a keyphrase", function() {
		const paper = new Paper( "text" );
		const researcher = Factory.buildMockResearcher( {} );
		const assessment = new IntroductionKeywordAssessment().getResult( paper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.hasAIFixes() ).toBeFalsy();
	} );
} );

describe( "a test for the keyphrase in first paragraph assessment when the exact match is requested", function() {
	it( "returns a bad result when the first paragraph doesn't contain the exact match of the keyphrase", function() {
		const mockPaper = new Paper(  "A cat is enjoying a walk in nature.", { keyword: "\"walking in nature\"" } );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( mockPaper, researcher );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: " +
			"Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' " +
			"target='_blank'>Make sure the topic is clear immediately</a>." );
	} );

	it( "returns a good result when the first paragraph contains the exact match of the keyphrase", function() {
		const mockPaper = new Paper( "A cat is enjoying walking in nature.", { keyword: "\"walking in nature\"" } );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "returns a good result when the first paragraph contains the exact match of the keyphrase in upper case with a period", function() {
		let mockPaper = new Paper( "What is ASP.NET", { keyword: "\"ASP.NET\"" } );
		let researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );
		let assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );

		mockPaper = new Paper( "What is ASP.net", { keyword: "\"ASP.NET\"" } );
		researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );
		assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );

		mockPaper = new Paper( "What is asp.NET", { keyword: "\"ASP.NET\"" } );
		researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );
		assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );

		mockPaper = new Paper( "What is asp.net", { keyword: "\"ASP.NET\"" } );
		researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );
		assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the synonym", function() {
		const mockPaper = new Paper( "A cat loves an activity in nature. A cat is enjoying a walk in nature.", {
			keyword: "\"walking in nature\"",
			synonyms: "activity in nature",
		} );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the exact match of the synonym", function() {
		const mockPaper = new Paper( "A cat loves an activity in nature. A cat is enjoying a walk in nature.", {
			keyword: "\"walking in nature\"",
			synonyms: "\"activity in nature\"",
		} );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );
} );
