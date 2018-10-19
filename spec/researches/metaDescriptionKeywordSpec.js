import metaDescriptionKeyword from "../../src/researches/metaDescriptionKeyword.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";

const mockResearcherWord = Factory.buildMockResearcher( { keyphraseForms: [ [ "word", "words" ] ] } );
const mockResearcherWordUmlaut = Factory.buildMockResearcher( { keyphraseForms: [ [ "keywörd", "keywörds" ] ] } );

// The morphological research escapes the forms that it adds to the list of forms, so we should mimic this behavior here.
const mockResearcherWordDollarSign = Factory.buildMockResearcher( { keyphraseForms: [ [ "\\$keyword", "\\$keywords" ] ] } );

const mockResearcherKeyWordPhrase = Factory.buildMockResearcher( {
	keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
	synonymsForms: [ [ [ "key", "keys" ], [ "phrase", "phrases" ] ] ],
} );

describe( "the metadescription keyword match research", function() {
	it( "returns the number ( 1 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a word" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 2 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a word and a word" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toEqual( 2 );
	} );

	it( "returns the number ( 0 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a bla" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toEqual( 0 );
	} );

	it( "returns -1 because there is no meta", function() {
		var paper = new Paper( "", { keyword: "word", description: "" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toBe( -1 );
	} );

	it( "returns the number ( 1 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "keywörd", description: "a description with a keyword", locale: "en_US" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWordUmlaut );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords found when the keyword begins with $", function() {
		var paper = new Paper( "", { keyword: "$keyword", description: "a description with a $keyword" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWordDollarSign );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords found when the keyword", function() {
		var paper = new Paper( "", { keyword: "key word", description: "a description with a key word and a key" } );
		var result = metaDescriptionKeyword( paper, mockResearcherKeyWordPhrase );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found", function() {
		var paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "a description with a key word and a phrase" } );
		var result = metaDescriptionKeyword( paper, mockResearcherKeyWordPhrase );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found", function() {
		var paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "a description with a key phrase" } );
		var result = metaDescriptionKeyword( paper, mockResearcherKeyWordPhrase );
		expect( result ).toEqual( 1 );
	} );
} );
