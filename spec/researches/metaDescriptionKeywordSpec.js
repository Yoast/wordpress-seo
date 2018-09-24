import metaDescriptionKeyword from "../../src/researches/metaDescriptionKeyword.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../helpers/factory.js";

const mockResearcherWord = Factory.buildMockResearcher( { keyphraseForms: [ [ "word", "words" ] ] } );
const mockResearcherWordUmlaut = Factory.buildMockResearcher( { keyphraseForms: [ [ "keywörd", "keywörds" ] ] } );
const mockResearcherWordDollarSign = Factory.buildMockResearcher( { keyphraseForms: [ [ "$keyword", "$keywords" ] ] } );

describe( "the metadescription keyword match research", function() {
	it( "returns the number ( 1 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a word" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toEqual( { fullDescription: 100, perSentence: [ 100 ] } );
	} );

	it( "returns the number ( 2 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a word and a word" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toEqual( { fullDescription: 100, perSentence: [ 100 ] } );
	} );

	it( "returns the number ( 0 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "word", description: "a description with a bla" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toEqual( { fullDescription: 0, perSentence: [ 0 ] } );
	} );

	it( "returns -1 because there is no meta", function() {
		var paper = new Paper( "", { keyword: "word", description: "" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWord );
		expect( result ).toBe( null );
	} );

	it( "returns the number ( 1 ) of keywords found", function() {
		var paper = new Paper( "", { keyword: "keywörd", description: "a description with a keyword", locale: "en_US" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWordUmlaut );
		expect( result ).toEqual( { fullDescription: 100, perSentence: [ 100 ] } );
	} );

	it( "returns the number ( 1 ) of keywords found when the keyword begins with $", function() {
		var paper = new Paper( "", { keyword: "$keyword", description: "a description with a $keyword" } );
		var result = metaDescriptionKeyword( paper, mockResearcherWordDollarSign );
		expect( result ).toEqual( { fullDescription: 100, perSentence: [ 100 ] } );
	} );
} );
