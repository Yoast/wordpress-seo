import { applySuffixesToStem, applySuffixesToStems } from "../../../src/morphology/morphoHelpers/suffixHelpers";

describe( "A test to apply multiple suffixes to a tem", () => {
	it( "Appends multiple suffixes to a stem", () => {
		expect( applySuffixesToStem( "stem", [ "a", "b", "c" ] ) ).toEqual( [
			"stema",
			"stemb",
			"stemc",
		] );
	} );

	it( "Appends multiple suffixes to a stem, with extra material appended in between the stem and each suffix", () => {
		expect( applySuffixesToStem( "stem", [ "a", "b", "c" ], "x" ) ).toEqual( [
			"stemxa",
			"stemxb",
			"stemxc",
		] );
	} );

	it( "Appends multiple suffixes to to each given stem", () => {
		expect( applySuffixesToStems( [ "stem1", "stem2" ], [ "a", "b", "c" ] ) ).toEqual( [
			"stem1a",
			"stem1b",
			"stem1c",
			"stem2a",
			"stem2b",
			"stem2c",
		] );
	} );

	it( "Appends multiple suffixes to to each given stem, with extra material appended in between each stem and each suffix", () => {
		expect( applySuffixesToStems( [ "stem1", "stem2" ], [ "a", "b", "c" ], "x" ) ).toEqual( [
			"stem1xa",
			"stem1xb",
			"stem1xc",
			"stem2xa",
			"stem2xb",
			"stem2xc",
		] );
	} );
} );
