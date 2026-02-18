import SubheadingsKeywordAssessment from "../../../../src/scoring/assessments/seo/SubHeadingsKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Mark from "../../../../src/values/Mark";
import buildTree from "../../../specHelpers/parse/buildTree";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" );

const assessment = new SubheadingsKeywordAssessment();

describe( "Tests for the keyphrase in subheadings assessment when no keyphrase and/or text is added", () => {
	it( "shows feedback for keyphrase in subheadings when there is a text but no keyphrase", () => {
		const paper = new Paper( "some text", { keyword: "" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const result = assessment.getResult( paper, researcher );
		expect( result.getScore() ).toBe( 1 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"<a href='https://yoa.st/33n' target='_blank'>Please add both a keyphrase and some text to receive relevant feedback</a>." );
		expect( assessment.getMarks().length ).toBe( 0 );
	} );
	it( "shows feedback for keyphrase in subheadings when there is no text", () => {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const result = assessment.getResult( paper, researcher );
		expect( result.getScore() ).toBe( 1 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"<a href='https://yoa.st/33n' target='_blank'>Please add both a keyphrase and some text to receive relevant feedback</a>." );
		expect( assessment.getMarks().length ).toBe( 0 );
	} );
	it( "shows feedback for keyphrase in subheadings when there is no keyphrase set and no text", () => {
		const paper = new Paper( "", { keyword: "keyphrase" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const result = assessment.getResult( paper, researcher );
		expect( result.getScore() ).toBe( 1 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"<a href='https://yoa.st/33n' target='_blank'>Please add both a keyphrase and some text to receive relevant feedback</a>." );
		expect( assessment.getMarks().length ).toBe( 0 );
	} );
} );

const shortText = "a ".repeat( 200 );
const longText = "a ".repeat( 330 );
const shortTextJapanese = "熱".repeat( 599 );
const longTextJapanese = "熱".repeat( 601 );

describe( "Tests for the keyphrase in subheadings assessment when there are no subheadings", () => {
	it( "shows feedback for keyphrase in subheadings when there is a short text with no subheadings", () => {
		const paper = new Paper( shortText, { keyword: "keyphrase" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const result = assessment.getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms, but your text is short enough and probably doesn't need them." );
		expect( assessment.getMarks().length ).toBe( 0 );
	} );
	it( "shows feedback for keyphrase in subheadings when there is a long text with no subheadings", () => {
		const paper = new Paper( longText, { keyword: "keyphrase" } );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );
		const result = assessment.getResult( paper, researcher );
		expect( result.getScore() ).toBe( 2 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms. <a href='https://yoa.st/33n' target='_blank'>Fix that</a>!" );
		expect( assessment.getMarks().length ).toBe( 0 );
	} );
	it( "shows correct feedback for keyphrase in subheadings when there is a Japanese short text with no subheadings", () => {
		const paper = new Paper( shortTextJapanese, { keyword: "鳥" } );
		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		const result = assessment.getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms, but your text is short enough and probably doesn't need them." );
		expect( assessment.getMarks().length ).toBe( 0 );
	} );
	it( "shows feedback for keyphrase in subheadings when there is a Japanese long text with no subheadings", () => {
		const paper = new Paper( longTextJapanese, { keyword: "鳥" } );
		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		const result = assessment.getResult( paper, researcher );
		expect( result.getScore() ).toBe( 2 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"You are not using any higher-level subheadings containing the keyphrase or its synonyms. <a href='https://yoa.st/33n' target='_blank'>Fix that</a>!" );
		expect( assessment.getMarks().length ).toBe( 0 );
	} );
} );

describe( "An assessment for matching keywords in subheadings", () => {
	it( "returns a bad score and appropriate feedback when none of the subheadings contain the keyphrase: no matches.", () => {
		const mockPaper = new Paper( shortText + "<h2>Subheading</h2>" + shortText, { keyword: "keyphrase" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
		expect( assessment.getMarks().length ).toBe( 0 );
	} );

	it( "returns a bad score and appropriate feedback when 2 of the 8 subheadings contain the keyphrase: too few matches.", () => {
		const mockPaper = new Paper(  shortText + "<h2>subheading with keyphrase</h2>" + shortText + "<h2>subheading with keyphrase</h2>" +
			shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" +
			shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading</h2>",
		{ keyword: "keyphrase" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
		expect( assessment.getMarks().length ).toBe( 2 );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeTruthy();
	} );

	it( "returns a good score and appropriate feedback when there is exactly one subheading and " +
		"that subheading contains a match -- 1 of 1.", () => {
		const mockPaper = new Paper( shortText + "<h2>subheading with keyphrase</h2>" + shortText, { keyword: "keyphrase" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading " +
			"reflects the topic of your copy. Good job!"
		);
		expect( assessment.getMarks().length ).toBe( 1 );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeTruthy();
	} );

	it( "returns a good score and appropriate feedback when there are multiple subheadings of which one contains a match: " +
		"good number of matches (singular).", () => {
		const mockPaper = new Paper( shortText + "<h2>subheading</h2>" + shortText + "<h2>subheading with keyphrase</h2>" + shortText,
			{ keyword: "keyphrase" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: 1 of your H2 and H3 subheadings " +
			"reflects the topic of your copy. Good job!"
		);
		expect( assessment.getMarks().length ).toBe( 1 );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeTruthy();
	} );

	it( "returns a good score and appropriate feedback when more than one subheading contains the keyphrase: " +
		"good number of matches (plural).", () => {
		const mockPaper = new Paper( shortText + "<h2>Subheading</h2>" + shortText + "<h2>Subheading</h2>" + shortText +
			"<h3>Subheading with keyphrase</h3>" + shortText + "<h3>Subheading with keyphrase</h3>" + shortText,  { keyword: "keyphrase" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: 2 of your H2 and H3 subheadings " +
			"reflect the topic of your copy. Good job!"
		);
		expect( assessment.getMarks().length ).toBe( 2 );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeTruthy();
	} );

	it( "returns a bad score and appropriate feedback when more than 75% of the H2 or H3 subheadings contains the keyphrase: " +
		"too many matches.", () => {
		const mockPaper = new Paper( shortText + "<h2>subheading</h2>" + shortText + "<h2>Subheading with keyphrase</h2>" + shortText +
			"<h2>Subheading with keyphrase</h2>" + shortText + "<h2>Subheading with keyphrase</h2>" + shortText +
			"<h2>Subheading with keyphrase</h2>" + shortText + "<h2>Subheading with keyphrase</h2>" + shortText +
			"<h3>Subheading with keyphrase</h3>" + shortText + "<h3>Subheading with keyphrase</h3>" + shortText,  { keyword: "keyphrase" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: More than 75% of your H2 " +
			"and H3 subheadings reflect the topic of your copy. That's too much. <a href='https://yoa.st/33n' " +
			"target='_blank'>Don't over-optimize</a>!"
		);
		expect( assessment.getMarks().length ).toBe( 7 );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeTruthy();
	} );

	it( "shouldn't return a match if the non-exact keyphrase is in the subheading but the exact keyphrase is not, when the keyphrase is in double quotes.", () => {
		const mockPaper = new Paper( shortText + "<h2>How to take care of cats</h2>" + shortText, { keyword: "\"caring for cats\"" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyData );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
		expect( assessment.getMarks().length ).toBe( 0 );
	} );

	it( "should return a match if the exact keyphrase is in the subheading when the keyphrase is in double quotes.", () => {
		const mockPaper = new Paper( shortText + "<h2>caring for cats</h2>" + shortText, { keyword: "\"caring for cats\"" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyData );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading reflects the topic of your copy. Good job!"
		);
		expect( assessment.getMarks().length ).toBe( 1 );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeTruthy();
	} );

	it( "should be able to match keyphrase in a multi-sentence heading", () => {
		const mockPaper = new Paper( shortText + "<h2>Want to be happy? Adopt a cat</h2>" + shortText, { keyword: "adopt a cat" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyData );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading reflects the topic of your copy. Good job!"
		);
		expect( assessment.getMarks().length ).toBe( 2 );
		expect( assessment.getMarks() ).toEqual( [
			new Mark( {
				marked: " <yoastmark class='yoast-text-mark'>Adopt</yoastmark> a <yoastmark class='yoast-text-mark'>cat</yoastmark>",
				original: " Adopt a cat",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 427,
					endOffsetBlock: 23,
					isFirstSection: false,
					startOffset: 422,
					startOffsetBlock: 18,
				},
			} ),
			new Mark( {
				marked: " <yoastmark class='yoast-text-mark'>Adopt</yoastmark> a <yoastmark class='yoast-text-mark'>cat</yoastmark>",
				original: " Adopt a cat",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 433,
					endOffsetBlock: 29,
					isFirstSection: false,
					startOffset: 430,
					startOffsetBlock: 26,
				},
			} ) ] );
	} );

	it( "returns a match when the keyphrase are found in a separate sentence in the subheading", () => {
		const mockPaper = new Paper( shortText + "<h2>Adopt a cat. You will be happy.</h2>" + shortText, { keyword: "adopt a happy cat" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyData );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading reflects the topic of your copy. Good job!"
		);
		expect( assessment.getMarks().length ).toBe( 3 );
		expect( assessment.getMarks() ).toEqual( [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>Adopt</yoastmark> a <yoastmark class='yoast-text-mark'>cat</yoastmark>.",
				original: "Adopt a cat.",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 409,
					endOffsetBlock: 5,
					isFirstSection: false,
					startOffset: 404,
					startOffsetBlock: 0,
				},
			} ),
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>Adopt</yoastmark> a <yoastmark class='yoast-text-mark'>cat</yoastmark>.",
				original: "Adopt a cat.",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 415,
					endOffsetBlock: 11,
					isFirstSection: false,
					startOffset: 412,
					startOffsetBlock: 8,
				},
			} ),
			new Mark( {
				marked: " You will be <yoastmark class='yoast-text-mark'>happy</yoastmark>.",
				original: " You will be happy.",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 434,
					endOffsetBlock: 30,
					isFirstSection: false,
					startOffset: 429,
					startOffsetBlock: 25,
				},
			} ),
		] );
	} );

	it( "checks isApplicable for a paper without text", () => {
		const paper = new Paper( "", { keyword: "some keyword" } );
		const isApplicableResult = assessment.isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper without keyword", () => {
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "" } );
		const isApplicableResult = assessment.isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper without subheadings", () => {
		const paper = new Paper( "<p>some text</p><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = assessment.isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper without h2 or h3 subheadings", () => {
		const paper = new Paper( "<p>some text</p><h4>heading</h4><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = assessment.isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );

	it( "checks isApplicable for a paper with text and keyword", () => {
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } );
		const isApplicableResult = assessment.isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );
} );

describe( "Test for SubheadingsKeywordAssessment for Japanese (the only language not using HTML parser yet)", () => {
	it( "returns a good score and appropriate feedback when the subheading contains the keyphrase.", () => {
		const mockPaper = new Paper( "<h3>日本の猫</h3>私は美しい猫を飼っています。野生のハーブの刺繡。", { keyword: "日本の猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading reflects the topic of your copy. Good job!"
		);
		expect( assessment.getMarks() ).toEqual( [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>日本</yoastmark>の<yoastmark class='yoast-text-mark'>猫</yoastmark>",
				original: "日本の猫",
			} ) ] );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeFalsy();
	} );
	it( "returns a bad score and appropriate feedback when the subheading does not contain the keyphrase.", () => {
		const mockPaper = new Paper( "<h2>大阪原産の植物</h2>私は美しい猫を飼っています。野生のハーブの刺繡。", { keyword: "日本の猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
		expect( assessment.getMarks().length ).toBe( 0 );
	} );

	it( "returns a bad score and appropriate feedback when the subheading contains a non-exact match of a Japanese keyphrase when the keyphrase" +
		" is in double quotes.", () => {
		const mockPaper = new Paper( "<h2>小さくて可愛い花の刺繍に関する一般一般の記事です</h2>私は美しい猫を飼っています。野生のハーブの刺繡。", { keyword: "『小さい花の刺繍』" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!"
		);
		expect( assessment.getMarks().length ).toBe( 0 );
	} );

	it( "returns a good score and appropriate feedback when the subheading contains an exact match of a Japanese keyphrase when the keyphrase" +
		" is in double quotes.", () => {
		const mockPaper = new Paper( "<h2>小さい花の刺繍</h2>私は美しい猫を飼っています。野生のハーブの刺繡。", { keyword: "『小さい花の刺繍』" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		const result = assessment.getResult( mockPaper, mockResearcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual(
			"<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: Your H2 or H3 subheading reflects the topic of your copy. Good job!"
		);
		expect( assessment.getMarks() ).toEqual( [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>小さい花の刺繍</yoastmark>",
				original: "小さい花の刺繍",
			} ) ] );
		expect( assessment.getMarks()[ 0 ]._properties.position ).toBeFalsy();
	} );
} );

describe( "Tests for SubheadingsKeywordAssessment in cornerstone content", () => {
	it( "should return the correct config when cornerstone content is on: non-Japanese", () => {
		const cornerstoneAssessment = new SubheadingsKeywordAssessment( {
			cornerstoneContent: true,
			parameters: { recommendedMaximumLength: 250 },
		} );
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } );
		const researcher = new DefaultResearcher( paper );
		const languageSpecificConfig = researcher.getConfig( "subheadingsTooLong" );
		const config = cornerstoneAssessment.getLanguageSpecificConfig( new DefaultResearcher( paper ), languageSpecificConfig );
		expect( config.parameters ).toEqual(
			{
				recommendedMaximumLength: 250,
				lowerBoundary: 0.3,
				upperBoundary: 0.75,
			} );
		expect( config.cornerstoneContent ).toBe( true );
	} );
	it( "should return the correct config when cornerstone content is on: Japanese", () => {
		const cornerstoneAssessment = new SubheadingsKeywordAssessment( {
			cornerstoneContent: true,
		} );
		const paper = new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } );
		const researcher = new JapaneseResearcher( paper );
		const languageSpecificConfig = researcher.getConfig( "subheadingsTooLong" );
		const config = cornerstoneAssessment.getLanguageSpecificConfig( new JapaneseResearcher( paper ), languageSpecificConfig );
		expect( config.parameters.recommendedMaximumLength ).toEqual( 500 );
		expect( config.cornerstoneContent ).toBe( true );
	} );
} );
