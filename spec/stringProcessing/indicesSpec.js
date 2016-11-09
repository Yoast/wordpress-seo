var indices = require ( "../../js/stringProcessing/indices.js" );
var getIndices = indices.getIndicesByWord;
var getIndicesOfList = indices.getIndicesByWordList;
var filterIndices = indices.filterIndices;
var sortIndices = indices.sortIndices;

describe( "A function to get indices from words in a string." , function( ) {
	it( "returns a list with a single word and its index", function() {
		expect ( getIndices( "string", "this is a string to test" ) ).toEqual ( [ { index: 10, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect ( getIndices( "string", "this is a string to test, a very nice string to test" ) ).toEqual ( [ { index: 10, match: "string" }, { index: 38, match: "string" } ] );
	} );
} );

describe( "A function to get indices from words in a word list in a string." , function( ) {
	it( "returns a list with a single word and its index", function() {
		expect ( getIndicesOfList( [ "string" ], "this is a string to test" ) ).toEqual ( [ { index: 10, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect ( getIndicesOfList( [ "string" ], "this is a string to test, a very nice string to test" ) ).toEqual ( [ { index: 10, match: "string" }, { index: 38, match: "string" } ] );
	} );
	it( "returns a list with multiple words and their indices", function() {
		expect ( getIndicesOfList( [ "string", "test" ], "this is a string to test" ) ).toEqual ( [ { index: 10, match: "string" }, { index: 20, match: "test" } ] );
	} );
} );

describe( "A function to filter out overlapping matches", function() {
	it( "removes the overlapping match 'though'", function() {
		var input = [
		{
			match: "even though",
			index: 10
		}, {
			match: "though",
			index: 15
		}
		];
		var expectedOutput = [
			{
				match: "even though",
				index: 10
			}
		];

		expect( filterIndices( input ) ).toEqual( expectedOutput );
	});

	it( "removes the overlapping match 'though', doesn't remove the non overlapping 'though' ", function() {
		var input = [
			{
				match: "even though",
				index: 10
			}, {
				match: "though",
				index: 15
			},
			{
				match: "though",
				index: 25
			}
		];
		var expectedOutput = [
			{
				match: "even though",
				index: 10
			},
			{
				match: "though",
				index: 25
			}
		];

		expect( filterIndices( input ) ).toEqual( expectedOutput );
	});

	it( "removes the overlapping match 'though', doesn't remove the non overlapping 'though' ", function() {
		var input = [
			{
				match: "word1",
				index: 10
			}, {
				match: "word2",
				index: 20
			}, {
				match: "word3",
				index: 30
			}
		];
		expect( filterIndices( input ) ).toEqual( input );
	});

});

describe( "A function that sorts an array based on the indices of the objects", function() {
	it( "returns a sorted array", function() {
		var input = [
			{
				match: "word2",
				index: 20
			}, {
				match: "word1",
				index: 10
			}, {
				match: "word3",
				index: 30
			}
		];
		var output = [
			{
				match: "word1",
				index: 10
			}, {
				match: "word2",
				index: 20
			}, {
				match: "word3",
				index: 30
			}
		];
		expect( sortIndices( input ) ).toEqual( output );
	} );
});
