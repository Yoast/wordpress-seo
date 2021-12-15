import metaDescriptionLength from "../../../src/languageProcessing/researches/metaDescriptionLength.js";
import Paper from "../../../src/values/Paper.js";

describe( "the meta description length research", function() {
	it( "returns the length of the description when the date is empty", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a word", date: "" } );
		const result = metaDescriptionLength( paper );
		expect( result ).toBe( 25 );
	} );

	it( "returns the length of the description when the date is not empty", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a word", date: "9 September 2021" } );
		const result = metaDescriptionLength( paper );
		expect( result ).toBe( 44 );
	} );

	it( "returns the length (0) of the description", function() {
		const paper = new Paper( "", { keyword: "word", description: "", date: "" } );
		const result = metaDescriptionLength( paper );
		expect( result ).toBe( 0 );
	} );
} );

describe( "the meta description length research for Japanese", function() {
	it( "returns the length of the description when the date is empty", function() {
		const paper = new Paper( "", { keyword: "言葉", description: "ほら、言葉の説明だ！良い言葉じゃないの？笑笑", date: "" } );
		const result = metaDescriptionLength( paper );
		expect( result ).toBe( 22 );
	} );

	it( "returns the length of the description when the date is not empty", function() {
		const paper = new Paper( "", { keyword: "言葉", description: "ほら、言葉の説明だ！良い言葉じゃないの？笑笑", date: "11月 8, 2021" } );
		const result = metaDescriptionLength( paper );
		expect( result ).toBe( 36 );
	} );
} );
