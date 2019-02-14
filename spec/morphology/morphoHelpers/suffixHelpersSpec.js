import { applySuffixes } from "../../../src/morphology/morphoHelpers/suffixHelpers";

describe( "A test to apply multiple suffixes to a tem", () => {
	it( "Appends multiple suffixes to a stem", () => {
		expect( applySuffixes( "stem", [ "a", "b", "c" ] ) ).toEqual( [
			"stema",
			"stemb",
			"stemc",
		] );
	} );

	it( "Appends multiple suffixes to a stem, with extra material appended in between the stem and each suffix", () => {
		expect( applySuffixes( "stem", [ "a", "b", "c" ], "x" ) ).toEqual( [
			"stemxa",
			"stemxb",
			"stemxc",
		] );
	} );
} );
