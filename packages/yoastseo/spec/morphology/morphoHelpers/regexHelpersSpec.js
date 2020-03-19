import { doesWordMatchRegex, searchAndReplaceWithRegex } from "../../../src/morphology/morphoHelpers/regexHelpers";

describe( "A test to return a regex match", () => {
	it( "Appends multiple suffixes to a stem", () => {
		expect( doesWordMatchRegex( "balletje", "etje$" ) ).toEqual( true );
	} );
} );

describe( "A test to apply multiple suffixes to a stem", () => {
	it( "Appends multiple suffixes to a stem", () => {
		expect( searchAndReplaceWithRegex( "balletje", [ [ "(et)(je)$", "$1" ], [ "(nn)(en)$", "$1" ] ] ) ).toEqual( "ballet" );
	} );
} );
