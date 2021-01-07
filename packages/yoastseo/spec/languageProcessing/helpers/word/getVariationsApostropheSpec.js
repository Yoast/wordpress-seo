import {
	getVariationsApostrophe,
	getVariationsApostropheInArray,
} from "../../../../src/languageProcessing/helpers/word/getVariationsApostrophe.js";

describe( "a test to check if the input word contains a normalized or a non-normalized apostrophe", function() {
	it( "generates a complementary form if the input word contains a normalized or a non-normalized apostrophe", function() {
		expect( getVariationsApostrophe( "il'y a" ) ).toEqual(
			[ "il'y a", "il‘y a", "il’y a", "il‛y a", "il`y a" ] );
	} );

	it( "doesn't generate a complementary form " +
		"if the input word doesn't contain a normalized or a non-normalized apostrophe", function() {
		expect( getVariationsApostrophe( "normal" ) ).toEqual( [ "normal" ] );
	} );
} );

describe( "applies getVariationsApostrophe to an array of strings", function() {
	it( "returns the original array with normalized and non-normalized apostrophes switched", function() {
		expect( getVariationsApostropheInArray( [ "il'y a", "il‘y a", "il’y a", "il‛y a", "il`y a" ] ) ).toEqual(
			[
				[ "il'y a", "il‘y a", "il’y a", "il‛y a", "il`y a" ],
				[ "il‘y a", "il'y a", "il’y a", "il‛y a", "il`y a" ],
				[ "il’y a", "il'y a", "il‘y a", "il‛y a", "il`y a" ],
				[ "il‛y a", "il'y a", "il‘y a", "il’y a", "il`y a" ],
				[ "il`y a", "il'y a", "il‘y a", "il’y a", "il‛y a" ],
			]
		);
	} );
} );
