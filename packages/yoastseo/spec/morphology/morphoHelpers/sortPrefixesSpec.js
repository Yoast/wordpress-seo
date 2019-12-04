import { allVerbPrefixesSorted } from "../../../src/morphology/morphoHelpers/sortPrefixes";

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
		expect( allVerbPrefixesSorted( prefixesTestData ) ).toEqual( [
			"aaa",
			"bbb",
			"ccc",
			"aa",
			"bb",
			"cc",
		] );
	} );
} );
