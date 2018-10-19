import metaDescriptionKeyword from "../../src/researches/metaDescriptionKeyword.js";
import Paper from "../../src/values/Paper.js";

import Researcher from "../../src/researcher";
import morphologyData from "../../premium-configuration/data/morphologyData.json";

describe( "the metadescription keyword match research", function() {
	it( "returns the number ( 1 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a word" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 2 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a word and a word" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 2 );
	} );

	it( "returns the number ( 0 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a bla" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 0 );
	} );

	it( "returns the number ( 1 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "keywörd", description: "a description with a keyword", locale: "en_US" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords found when the keyword begins with $", function() {
		const paper = new Paper( "", { keyword: "$keyword", description: "a description with a $keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords found when the keyword", function() {
		const paper = new Paper( "", { keyword: "key word", description: "a description with a key word and a key" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "a description with a key word and a phrase" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "a description with a key phrase" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 3 ) of keywords and synonyms found", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "Keys word. Key wordly. Keys phrases." } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 3 );
	} );

	it( "returns the number ( 3 ) of keywords and synonyms found, even when the keyphrase contains function words.", function() {
		const paper = new Paper( "", { keyword: "key and word", synonyms: "key or phrase", description: "Keys word. Key wordly. Keys phrases." } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 3 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found, with no morphology data.", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "Key word. Key wordly. Keys phrases." } );
		const researcher = new Researcher( paper );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 2 ) of keywords and synonyms found, with no morphology data.", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "Key word. Key wordly. Key phrase." } );
		const researcher = new Researcher( paper );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 2 );
	} );
} );
