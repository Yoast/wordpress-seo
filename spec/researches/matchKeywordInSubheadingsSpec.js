import subheadingFunction from "../../src/researches/matchKeywordInSubheadings.js";
import Paper from "../../src/values/Paper.js";
import Researcher from "../../src/researcher";
import Factory from "../specHelpers/factory";

describe( "a test for matching subheadings", function() {
	it( "returns the number of subheadings in the text", function() {
		let mockPaper = new Paper( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		let mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'keyword' ] ], synonymsForms: [ ],
		} );
		let result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.count ).toBe( 1 );

		mockPaper = new Paper( "<h2>Lorem ipsum</h2><h2>Lorem ipsum</h2><h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.count ).toBe( 3 );
	} );
} );

describe( "A test for matching keywords in subheadings", function() {
	it( "returns the number of matches in a subheading", function() {
		let mockPaper = new Paper( "<h2>Lorem ipsum $keyword</h2>", { keyword: "$keyword" } );
		const mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ '\\$keyword' ] ], synonymsForms: [ ],
		} );
		let result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
	} );
} );

describe( "a test for matching keywords in subheadings", function() {
	it( "returns the number of matches in the subheadings", function() {
		let mockPaper = new Paper( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		let mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'keyword' ] ], synonymsForms: [ ],
		} );
		let result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches ).toBe( 0 );

		mockPaper = new Paper( "Pellentesque sit amet justo ex. Suspendisse feugiat pulvinar leo eu consectetur" );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ ] ], synonymsForms: [ ],
		} );
		result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.count ).toBe( 0 );

		mockPaper = new Paper( "<h2>this is a heading with a diacritic keyword kapaklı </h2>", { keyword: "kapaklı" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "kapaklı" ] ], synonymsForms: [ ],
		} );
		result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );

		mockPaper = new Paper( "<h2>this is a heading with a dashed key-word</h2>", { keyword: "key-word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'key-word', 'key-words' ] ], synonymsForms: [ ],
		} );
		result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );

		mockPaper = new Paper( "<h2>this is a heading with an underscored key_word</h2>", { keyword: "key_word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'key_word', 'key_words' ] ], synonymsForms: [ ],
		} );
		result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );

		mockPaper = new Paper( "<h2>this is a heading with a dashed key-word</h2>", { keyword: "key word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'key', 'keys' ], [ 'word', 'words' ] ], synonymsForms: [ ],
		} );
		result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );

		mockPaper = new Paper( "<h2>this is a heading with an underscored key_word</h2>", { keyword: "key word" } );
		mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'key', 'keys' ], [ 'word', 'words' ] ], synonymsForms: [ ],
		} );
		result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 0 );
	} );

	it( "should not count headings when less than half of the keywords are in it", function() {
		let mockPaper = new Paper(
			"<h1>Here are some key words: Abraham, Cats</h1><h2>Here are some more: Abraham</h2>"
		);
		let mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'abraham', 'abrahams' ], [ 'banner', 'banners' ], [ 'cat', 'cats' ] ], synonymsForms: [ ],
		} );
		// First heading has 2/3 key words, so should match (2/3 > 1/2), second heading should not (1/2 == 1/2)
		let result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
	} );

	it( "should keep synonyms into account when checking subheadings for keywords", function() {
		let mockPaper = new Paper(
			"<h1>Here are some key words: Abraham, Cats</h1><h2>Here are some more: Abraham</h2>"
		);
		let mockResearcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ 'abraham', 'abrahams' ], [ 'Darth', 'Darths' ] ], synonymsForms: [ [ [ 'cat', 'cats' ] ], [ [ 'banner', 'banners' ] ] ],
		} );
		// First heading matches key phrase "cats" 100% in first heading, so is counted as one.
		let result = subheadingFunction( mockPaper, mockResearcher );
		expect( result.matches ).toBe( 1 );
	} );
} );
