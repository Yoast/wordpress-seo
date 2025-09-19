import SubheadingsKeywordAssessment from "../../../../src/scoring/assessments/seo/SubHeadingsKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../../src/helpers/factory";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import buildTree from "../../../specHelpers/parse/buildTree";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";

const matchKeywordAssessment = new SubheadingsKeywordAssessment();

describe( "Tests for the keyphrase in subheadings assessment when no keyphrase and/or text is added", function() {
	it( "shows feedback for keyphrase in subheadings when there is a text but no keyphrase", function() {
		const paper = new Paper( "some text", { keyword: "" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SubheadingsKeywordAssessment().getResult( paper, researcher );
		expect( assessment.getScore() ).toBe( 1 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"<a href='https://yoa.st/33n' target='_blank'>Please add both a keyphrase and some text to receive relevant feedback</a>." );
	} );
	it( "shows feedback for keyphrase in subheadings when there is no text", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SubheadingsKeywordAssessment().getResult( paper, researcher );
		expect( assessment.getScore() ).toBe( 1 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"<a href='https://yoa.st/33n' target='_blank'>Please add both a keyphrase and some text to receive relevant feedback</a>." );
	} );
	it( "shows feedback for keyphrase in subheadings when there is no keyphrase set and no text", function() {
		const paper = new Paper( "", { keyword: "keyphrase" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SubheadingsKeywordAssessment().getResult( paper, researcher );
		expect( assessment.getScore() ).toBe( 1 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"<a href='https://yoa.st/33n' target='_blank'>Please add both a keyphrase and some text to receive relevant feedback</a>." );
	} );
} );

const shortText = "a ".repeat( 200 );
const longText = "a ".repeat( 330 );
const shortTextJapanese = "熱".repeat( 599 );
const longTextJapanese = "熱".repeat( 601 );

describe( "Tests for the keyphrase in subheadings assessment when there are no subheadings", function() {
	it( "shows feedback for keyphrase in subheadings when there is a short text with no subheadings", function() {
		const paper = new Paper( shortText, { keyword: "keyphrase" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SubheadingsKeywordAssessment().getResult( paper, researcher );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms, but your text is short enough and probably doesn't need them." );
	} );
	it( "shows feedback for keyphrase in subheadings when there is a long text with no subheadings", function() {
		const paper = new Paper( longText, { keyword: "keyphrase" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SubheadingsKeywordAssessment().getResult( paper, researcher );
		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms. <a href='https://yoa.st/33n' target='_blank'>Fix that</a>!" );
	} );
	it( "shows correct feedback for keyphrase in subheadings when there is a Japanese short text with no subheadings", function() {
		const paper = new Paper( shortTextJapanese, { keyword: "鳥" } );
		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SubheadingsKeywordAssessment().getResult( paper, researcher );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms, but your text is short enough and probably doesn't need them." );
	} );
	it( "shows feedback for keyphrase in subheadings when there is a Japanese long text with no subheadings", function() {
		const paper = new Paper( longTextJapanese, { keyword: "鳥" } );
		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SubheadingsKeywordAssessment().getResult( paper, researcher );
		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms. <a href='https://yoa.st/33n' target='_blank'>Fix that</a>!" );
	} );
} );

describe( "An assessment for matching keywords in subheadings", () => {
	it( "returns a bad score and appropriate feedback when none of the subheadings contain the keyphrase: no matches.", function() {
		const mockPaper = new Paper( shortText + "<h2>Subheading</h2>" + shortText, { keyword: "keyphrase" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = new SubheadingsKeywordAssessment().getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
	} );

	it( "returns a bad score and appropriate feedback when 2 of the 8 subheadings contain the keyphrase: too few matches.", function() {
		const mockPaper = new Paper(  shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" +
			shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" +
			shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>",
		{ keyword: "keyphrase" } );
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
		const mockPaper = new Paper( shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>", { keyword: "keyphrase" } );
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
		const mockPaper = new Paper( shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>",
			{ keyword: "keyphrase" } );
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
		const mockPaper = new Paper( shortText + "<h2>Subheading</h2>" + shortText + "<h2>Subheading</h2>",  { keyword: "keyphrase" } );
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
		const mockPaper = new Paper( shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>",  { keyword: "keyphrase" } );
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
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper without keyword", function() {
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper without subheadings", function() {
		const paper = new Paper( "<p>some text</p><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper without h2 or h3 subheadings", function() {
		const paper = new Paper( "<p>some text</p><h4>heading</h4><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper with text and keyword", function() {
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );
} );

describe( "Tests for SubheadingsKeywordAssessment in cornerstone content", () => {
	it( "should return the correct config when cornerstone content is on: non-Japanese", () => {
		const assessment = new SubheadingsKeywordAssessment( {
			cornerstoneContent: true,
			parameters: { recommendedMaximumLength: 250 },
		} );
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } );
		const researcher = new DefaultResearcher( paper );
		const languageSpecificConfig = researcher.getConfig( "subheadingsTooLong" );
		const config = assessment.getLanguageSpecificConfig( new DefaultResearcher( paper ), languageSpecificConfig );
		expect( config.parameters ).toEqual(
			{
				recommendedMaximumLength: 250,
				lowerBoundary: 0.3,
				upperBoundary: 0.75,
			} );
		expect( config.cornerstoneContent ).toBe( true );
	} );
	it( "should return the correct config when cornerstone content is on: Japanese", () => {
		const assessment = new SubheadingsKeywordAssessment( {
			cornerstoneContent: true,
		} );
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } );
		const researcher = new JapaneseResearcher( paper );
		const languageSpecificConfig = researcher.getConfig( "subheadingsTooLong" );
		const config = assessment.getLanguageSpecificConfig( new JapaneseResearcher( paper ), languageSpecificConfig );
		expect( config.parameters.recommendedMaximumLength ).toEqual( 500 );
		expect( config.cornerstoneContent ).toBe( true );
	} );
} );
