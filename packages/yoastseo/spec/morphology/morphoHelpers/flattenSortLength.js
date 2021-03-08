import { flattenSortLength } from "../../../src/morphology/morphoHelpers/flattenSortLength";

const prefixesTestData = {
	categoryA: [
		"aaa",
		"bbb",
		"aa",
		"bb",
	],
	categoryB: [
		"ccc",
		"cc",
	],
};

describe( "Test for getting all verb prefixes sorted by length", () => {
	it( "gets all verb prefixes sorted by length", () => {
		expect( flattenSortLength( prefixesTestData ) ).toEqual( [
			"aaa",
			"bbb",
			"ccc",
			"aa",
			"bb",
			"cc",
		] );
	} );
} );
