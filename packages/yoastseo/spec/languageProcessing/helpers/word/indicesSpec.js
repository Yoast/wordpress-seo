import indices from "../../../../src/languageProcessing/helpers/word/indices.js";
const getIndices = indices.getIndicesByWord;
const getIndicesOfList = indices.getIndicesByWordList;
const getIndicesByWordListSorted = indices.getIndicesByWordListSorted;
const filterIndices = indices.filterIndices;
const sortIndices = indices.sortIndices;
const getIndicesByWord = indices.getIndicesByWord;

describe( "A function to get indices from words in a string.", function() {
	it( "returns a list with a single word and its index", function() {
		expect( getIndices( "string", "this is a string to test" ) ).toEqual( [ { index: 10, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndices( "string", "this is a string to test, a very nice string to test" ) )
			.toEqual( [ { index: 10, match: "string" }, { index: 38, match: "string" } ] );
	} );
} );

describe( "A function to get indices from words in a word list in a string.", function() {
	it( "returns a list with a single word and its index", function() {
		expect( getIndicesOfList( [ "string" ], "this is a string to test" ) )
			.toEqual( [ { index: 10, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesOfList( [ "string" ], "this is a string to test, a very nice string to test" ) )
			.toEqual( [ { index: 10, match: "string" }, { index: 38, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesOfList( [ "string", "test" ], "this is a string to test" ) )
			.toEqual( [ { index: 10, match: "string" }, { index: 20, match: "test" } ] );
	} );
	it( "returns an empty array if there is no match found", function() {
		expect( getIndicesOfList( [ "cats", "dogs" ], "this is a string to test" ) ).toEqual( [] );
	} );
} );

describe( "A function to get indices from words in a word list in a string and make sure they are sorted by occurrence.", function() {
	it( "returns a list with a single word and its index", function() {
		expect( getIndicesByWordListSorted( [ "string" ], "this is a string to test" ) )
			.toEqual( [ { index: 10, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesByWordListSorted( [ "string" ], "this is a string to test, a very nice string to test" ) )
			.toEqual( [ { index: 10, match: "string" }, { index: 38, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesByWordListSorted( [ "string", "test" ], "this is a string to test" ) )
			.toEqual( [ { index: 10, match: "string" }, { index: 20, match: "test" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesByWordListSorted( [ "string", "test" ], "this is a string to test and another string to test" ) )
			.toEqual( [
				{ index: 10, match: "string" },
				{ index: 20, match: "test" },
				{ index: 37, match: "string" },
				{ index: 47, match: "test" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesByWordListSorted( [ "test", "string" ], "this is a string to test and another string to test" ) )
			.toEqual( [
				{ index: 10, match: "string" },
				{ index: 20, match: "test" },
				{ index: 37, match: "string" },
				{ index: 47, match: "test" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesByWordListSorted( [ "string", "test" ], "this is a string and another string to test and to test again" ) )
			.toEqual( [
				{ index: 10, match: "string" },
				{ index: 29, match: "string" }, { index: 39, match: "test" }, { index: 51, match: "test" } ] );
	} );
	it( "searches for a list of words, but returns nothing if they are not in the sentence", function() {
		expect( getIndicesByWordListSorted( [ "string1", "test1" ], "this is a string and another string to test and to test again" ) ).toEqual( [] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect( getIndicesByWordListSorted(
			[ "string", "string and" ],
			"this is a string and another string to test and to test again" ) )
			.toEqual( [ { index: 10, match: "string" }, { index: 10, match: "string and" }, { index: 29, match: "string" } ] );
	} );
} );

describe( "A function to filter out overlapping matches", function() {
	it( "removes the overlapping match 'though'", function() {
		const input = [
			{
				match: "even though",
				index: 10,
			}, {
				match: "though",
				index: 15,
			},
		];
		const expectedOutput = [
			{
				match: "even though",
				index: 10,
			},
		];

		expect( filterIndices( input ) ).toEqual( expectedOutput );
	} );

	it( "removes the overlapping match 'though', doesn't remove the non overlapping 'though' ", function() {
		const input = [
			{
				match: "even though",
				index: 10,
			}, {
				match: "though",
				index: 15,
			},
			{
				match: "though",
				index: 25,
			},
		];
		const expectedOutput = [
			{
				match: "even though",
				index: 10,
			},
			{
				match: "though",
				index: 25,
			},
		];

		expect( filterIndices( input ) ).toEqual( expectedOutput );
	} );

	it( "removes the overlapping match 'though', doesn't remove the non overlapping 'though' ", function() {
		const input = [
			{
				match: "word1",
				index: 10,
			}, {
				match: "word2",
				index: 20,
			}, {
				match: "word3",
				index: 30,
			},
		];
		expect( filterIndices( input ) ).toEqual( input );
	} );
} );

describe( "A function that returns all instances of the input word and their index when there is one match", function() {
	it( "returns an array", function() {
		const word = "is";
		const text = "praise is";
		const output = [
			{
				match: "is",
				index: 7,
			},
		];
		expect( getIndicesByWord( word, text ) ).toEqual( output );
	} );
} );

describe( "A function that returns all instances of the input word and their index when there are multiple matches", function() {
	it( "returns an array", function() {
		const word = "is";
		const text = "is praise is praise is";
		const output = [
			{
				match: "is",
				index: 0,
			},
			{
				match: "is",
				index: 10,
			},
			{
				match: "is",
				index: 20,
			},
		];
		expect( getIndicesByWord( word, text ) ).toEqual( output );
	} );
} );

describe( "A function that returns all instances of the input word and their index when there is no match", function() {
	it( "returns an array", function() {
		const word = "is";
		const text = "praise";
		const output = [];
		expect( getIndicesByWord( word, text ) ).toEqual( output );
	} );
} );

describe( "A function that sorts an array based on the indices of the objects", function() {
	it( "returns a sorted array", function() {
		const input = [
			{
				match: "word2",
				index: 20,
			}, {
				match: "word1",
				index: 10,
			}, {
				match: "word3",
				index: 30,
			},
		];
		const output = [
			{
				match: "word1",
				index: 10,
			}, {
				match: "word2",
				index: 20,
			}, {
				match: "word3",
				index: 30,
			},
		];
		expect( sortIndices( input ) ).toEqual( output );
	} );
} );
