import { allGermanVerbPrefixesSorted } from "../../../src/morphology/german/helpers";

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

describe( "Test for getting all German verb prefixes sorted by length", () => {
	it( "gets all German verb prefixes sorted by length", () => {
		expect( allGermanVerbPrefixesSorted( prefixesTestData ) ).toEqual( [
			"aaa",
			"bbb",
			"ccc",
			"aa",
			"bb",
			"cc",
		] );
	} );
} );
