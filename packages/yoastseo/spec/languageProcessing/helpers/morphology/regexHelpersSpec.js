import {
	doesWordMatchRegex,
	searchAndReplaceWithRegex,
	applyAllReplacements,
} from "../../../../src/languageProcessing/helpers/morphology/regexHelpers";

describe( "A test to return a regex match", () => {
	it( "Appends multiple suffixes to a stem", () => {
		expect( doesWordMatchRegex( "balletje", "etje$" ) ).toEqual( true );
	} );
} );

describe( "A test to apply multiple suffixes to a stem (stops after first match is found)", () => {
	it( "Appends multiple suffixes to a stem", () => {
		expect( searchAndReplaceWithRegex( "balletje", [ [ "(et)(je)$", "$1" ], [ "(nn)(en)$", "$1" ] ] ) ).toEqual( "ballet" );
	} );

	it( "Stops after the first match is found", () => {
		expect( searchAndReplaceWithRegex( "abc", [ [ "a", "x" ], [ "c", "z" ] ] ) ).toEqual( "xbc" );
	} );

	it( "Returns undefined no match is found", () => {
		expect( searchAndReplaceWithRegex( "abc", [ [ "d", "x" ], [ "e", "z" ] ] ) ).toBeUndefined();
	} );
} );

describe( "A test to cumulatively apply multiple replacements", () => {
	it( "Cumulatively applies multiple changes to a word", () => {
		expect( applyAllReplacements( "abc", [ [ "a", "x" ], [ "c", "z" ] ] ) ).toEqual( "xbz" );
	} );

	it( "Returns the original word if no match is found", () => {
		expect( applyAllReplacements( "abc", [ [ "d", "x" ], [ "e", "z" ] ] ) ).toEqual( "abc" );
	} );
} );
