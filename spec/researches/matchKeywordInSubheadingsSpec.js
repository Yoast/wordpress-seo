import matchKeywordInSubheadings from "../../src/researches/matchKeywordInSubheadings";
import Paper from "../../src/values/Paper";
import Factory from "../specHelpers/factory";

describe( "a test for matching subheadings", function() {
	it( "returns the number of subheadings in the text", function() {
		let mockPaper = new Paper( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		const mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "keyword" ] ], synonymsForms: [ ],
		} );
		let result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.count ).toBe( 1 );

		mockPaper = new Paper( "<h2>Lorem ipsum</h2><h2>Lorem ipsum</h2><h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.count ).toBe( 3 );
	} );
} );

describe( "A test for matching keywords in subheadings", function() {
	it( "returns the number of matches in a subheading", function() {
		const mockPaper = new Paper( "<h2>Lorem ipsum $keyword</h2>", { keyword: "$keyword" } );
		const mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "\\$keyword" ] ], synonymsForms: [ ],
		} );
		const result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 100 );
	} );
} );

describe( "a test for matching keywords in subheadings", function() {
	it( "returns the number of matches in the subheadings", function() {
		let mockPaper = new Paper( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		let mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "keyword" ] ], synonymsForms: [ ],
		} );
		let result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches ).toBe( 0 );
		expect( result.percentReflectingTopic ).toBe( 0 );

		mockPaper = new Paper( "Pellentesque sit amet justo ex. Suspendisse feugiat pulvinar leo eu consectetur" );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ ] ], synonymsForms: [ ],
		} );
		result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.count ).toBe( 0 );
		expect( result.matches ).toBe( 0 );
		expect( result.percentReflectingTopic ).toBe( 0 );

		mockPaper = new Paper( "<h2>this is a heading with a diacritic keyword kapaklı </h2>", { keyword: "kapaklı" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "kapaklı" ] ], synonymsForms: [ ],
		} );
		result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 100 );

		mockPaper = new Paper( "<h2>this is a heading with a dashed key-word</h2>", { keyword: "key-word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "key-word", "key-words" ] ], synonymsForms: [ ],
		} );
		result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 100 );

		mockPaper = new Paper( "<h2>this is a heading with an underscored key_word</h2>", { keyword: "key_word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "key_word", "key_words" ] ], synonymsForms: [ ],
		} );
		result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 100 );

		mockPaper = new Paper( "<h2>this is a heading with a dashed key-word</h2>", { keyword: "key word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ], synonymsForms: [ ],
		} );
		result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 100 );

		mockPaper = new Paper( "<h2>this is a heading with an underscored key_word</h2>", { keyword: "key word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ], synonymsForms: [ ],
		} );
		result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 0 );
		expect( result.percentReflectingTopic ).toBe( 0 );
	} );

	it( "should not count headings when less than half of the keywords are in it", function() {
		const mockPaper = new Paper(
			"<h1>Here are some key words: Abraham, Cats</h1><h2>Here are some more: Abraham</h2>"
		);
		const mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "abraham", "abrahams" ], [ "banner", "banners" ], [ "cat", "cats" ] ], synonymsForms: [ ],
		} );
		// First heading has 2/3 key words, so should match (2/3 > 1/2), second heading should not (1/2 == 1/2)
		const result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 50 );
	} );

	it( "should keep synonyms into account when checking subheadings for keywords", function() {
		const mockPaper = new Paper(
			"<h1>Here are some key words: Abraham, Cats</h1><h2>Here are some more: Abraham</h2>"
		);
		const mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "abraham", "abrahams" ], [ "Darth", "Darths" ] ], synonymsForms: [ [ [ "cat", "cats" ] ], [ [ "banner", "banners" ] ] ],
		} );
		// First heading matches key phrase "cats" 100% in first heading, so is counted as one.
		const result = matchKeywordInSubheadings( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 50 );
	} );
} );

describe( "Matching keyphrase in subeadings with recalibration enabled", () => {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "enabled";
	} );

	it( "matches only h2 and h3 subheadings", () => {
		const paper = new Paper(
			"<h2>Start of post</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper!</h3><p>More text here.</p>" +
			"<h4>Even more?</h4><p>Yes, even more.</p>",
			{},
		);
		const researcher = Factory.buildMockResearcher( {
			keyphraseForms: [],
			synonymsForms: [],
		} );
		const result = matchKeywordInSubheadings( paper, researcher );

		// Would be 3 if the h4 was counted too.
		expect( result.count ).toBe( 2 );
		expect( result.propertyIsEnumerable( 0 ) );
	} );
} );
