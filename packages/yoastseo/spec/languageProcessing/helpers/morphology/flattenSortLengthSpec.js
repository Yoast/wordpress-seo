import { flattenSortLength } from "../../../../src/languageProcessing/helpers/morphology/flattenSortLength";

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

describe( "Test for getting all strings/words sorted by length", () => {
	it( "gets all strings/words sorted by length", () => {
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
