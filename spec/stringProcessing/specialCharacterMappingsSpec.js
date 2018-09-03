import { arraysOverlap, arraysDifference, getIndicesOfWords, getIndicesOfCharacter, replaceTurkishIs, replaceTurkishIsMemoized } from "../../js/stringProcessing/specialCharacterMappings";

describe( "a test for substituting Turkish letters in a string", function() {
	it( "returns an array with the original string if there are no Is", function() {
		expect( replaceTurkishIs( "Turkcell'le Bağlan Hayata" ) ).toEqual( [ "Turkcell'le Bağlan Hayata" ] );
	} );

	it( "returns an array with all substitutions for a string with İ", function() {
		expect( replaceTurkishIs( "İstanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "returns an array with all substitutions for a string with i", function() {
		expect( replaceTurkishIs( "istanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "returns an array with all substitutions for a string with I", function() {
		expect( replaceTurkishIs( "Istanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "returns an array with all substitutions for a string with ı", function() {
		expect( replaceTurkishIs( "ıstanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "only checks the first position in the word", function() {
		expect( replaceTurkishIs( "ıstanbulI" ) ).toEqual( [ "İstanbulI", "IstanbulI", "istanbulI", "ıstanbulI" ] );
		expect( replaceTurkishIs( "ıstanbulİ" ) ).toEqual( [ "İstanbulİ", "Istanbulİ", "istanbulİ", "ıstanbulİ" ] );
		expect( replaceTurkishIs( "İstanbuli" ) ).toEqual( [ "İstanbuli", "Istanbuli", "istanbuli", "ıstanbuli" ] );
	} );

	it( "returns an array with all possible substitutions for a string with İ I i ı", function() {
		const sample = "İ I i ı";
		expect( replaceTurkishIs( sample ) ).toEqual( [
			"İ I i ı", "İ I ı i", "İ I i i", "İ I ı ı", "İ i I ı", "İ ı I i", "İ i I i", "İ ı I ı", "İ I I i", "İ I I ı",
			"İ i ı I", "İ ı i I", "İ i i I", "İ ı ı I", "İ I i I", "İ I ı I", "İ i I I", "İ ı I I", "İ I I I", "İ i ı ı",
			"İ ı i ı", "İ i i ı", "İ ı ı i", "İ i ı i", "İ ı i i", "İ i i i", "İ ı ı ı", "I İ i ı", "I İ ı i", "I İ i i",
			"I İ ı ı", "i İ I ı", "ı İ I i", "i İ I i", "ı İ I ı", "I İ I i", "I İ I ı", "i İ ı I", "ı İ i I", "i İ i I",
			"ı İ ı I", "I İ i I", "I İ ı I", "i İ I I", "ı İ I I", "I İ I I", "i İ ı ı", "ı İ i ı", "i İ i ı", "ı İ ı i",
			"i İ ı i", "ı İ i i", "i İ i i", "ı İ ı ı", "İ İ I i", "İ İ I ı", "İ İ i I", "İ İ ı I", "İ İ I I", "İ İ i ı",
			"İ İ ı i", "İ İ i i", "İ İ ı ı", "I i İ ı", "I ı İ i", "I i İ i", "I ı İ ı", "i I İ ı", "ı I İ i", "i I İ i",
			"ı I İ ı", "I I İ i", "I I İ ı", "i ı İ I", "ı i İ I", "i i İ I", "ı ı İ I", "I i İ I", "I ı İ I", "i I İ I",
			"ı I İ I", "I I İ I", "i ı İ ı", "ı i İ ı", "i i İ ı", "ı ı İ i", "i ı İ i", "ı i İ i", "i i İ i", "ı ı İ ı",
			"İ I İ i", "İ I İ ı", "İ i İ I", "İ ı İ I", "İ I İ I", "İ i İ ı", "İ ı İ i", "İ i İ i", "İ ı İ ı", "I İ İ i",
			"I İ İ ı", "i İ İ I", "ı İ İ I", "I İ İ I", "i İ İ ı", "ı İ İ i", "i İ İ i", "ı İ İ ı", "İ İ İ I", "İ İ İ i",
			"İ İ İ ı", "I i ı İ", "I ı i İ", "I i i İ", "I ı ı İ", "i I ı İ", "ı I i İ", "i I i İ", "ı I ı İ", "I I i İ",
			"I I ı İ", "i ı I İ", "ı i I İ", "i i I İ", "ı ı I İ", "I i I İ", "I ı I İ", "i I I İ", "ı I I İ", "I I I İ",
			"i ı ı İ", "ı i ı İ", "i i ı İ", "ı ı i İ", "i ı i İ", "ı i i İ", "i i i İ", "ı ı ı İ", "İ I i İ", "İ I ı İ",
			"İ i I İ", "İ ı I İ", "İ I I İ", "İ i ı İ", "İ ı i İ", "İ i i İ", "İ ı ı İ", "I İ i İ", "I İ ı İ", "i İ I İ",
			"ı İ I İ", "I İ I İ", "i İ ı İ", "ı İ i İ", "i İ i İ", "ı İ ı İ", "İ İ I İ", "İ İ i İ", "İ İ ı İ", "I i İ İ",
			"I ı İ İ", "i I İ İ", "ı I İ İ", "I I İ İ", "i ı İ İ", "ı i İ İ", "i i İ İ", "ı ı İ İ", "İ I İ İ", "İ i İ İ",
			"İ ı İ İ", "I İ İ İ", "i İ İ İ", "ı İ İ İ", "İ İ İ İ", "I i ı ı", "I ı i ı", "I i i ı", "I ı ı i", "I i ı i",
			"I ı i i", "I i i i", "I ı ı ı", "i I ı ı", "ı I i ı", "i I i ı", "ı I ı i", "i I ı i", "ı I i i", "i I i i",
			"ı I ı ı", "I I i ı", "I I ı i", "I I i i", "I I ı ı", "i ı I ı", "ı i I ı", "i i I ı", "ı ı I i", "i ı I i",
			"ı i I i", "i i I i", "ı ı I ı", "I i I ı", "I ı I i", "I i I i", "I ı I ı", "i I I ı", "ı I I i", "i I I i",
			"ı I I ı", "I I I i", "I I I ı", "i ı ı I", "ı i ı I", "i i ı I", "ı ı i I", "i ı i I", "ı i i I", "i i i I",
			"ı ı ı I", "I i ı I", "I ı i I", "I i i I", "I ı ı I", "i I ı I", "ı I i I", "i I i I", "ı I ı I", "I I i I",
			"I I ı I", "i ı I I", "ı i I I", "i i I I", "ı ı I I", "I i I I", "I ı I I", "i I I I", "ı I I I", "I I I I",
			"i ı ı ı", "ı i ı ı", "i i ı ı", "ı ı i ı", "i ı i ı", "ı i i ı", "i i i ı", "ı ı ı i", "i ı ı i", "ı i ı i",
			"i i ı i", "ı ı i i", "i ı i i", "ı i i i", "i i i i", "ı ı ı ı",
		] );

		const indicesOfAllIs = getIndicesOfCharacter( sample, "İ" ).concat(
			getIndicesOfCharacter( sample, "I" ),
			getIndicesOfCharacter( sample, "i" ),
			getIndicesOfCharacter( sample, "ı" )
		);

		expect( replaceTurkishIs( sample ).length ).toBe( Math.pow( indicesOfAllIs.length, 4 ) );
	} );
} );

describe( "a test for substituting Turkish letters in a string using the memoized function", function() {
	it( "returns an array with the original string if there are no Is", function() {
		expect( replaceTurkishIsMemoized( "Turkcell'le Bağlan Hayata" ) ).toEqual( [ "Turkcell'le Bağlan Hayata" ] );
	} );

	it( "returns an array with all substitutions for a string with İ", function() {
		expect( replaceTurkishIsMemoized( "İstanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "returns an array with all substitutions for a string with i", function() {
		expect( replaceTurkishIsMemoized( "istanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "returns an array with all substitutions for a string with I", function() {
		expect( replaceTurkishIsMemoized( "Istanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "returns an array with all substitutions for a string with ı", function() {
		expect( replaceTurkishIsMemoized( "ıstanbul" ) ).toEqual( [ "İstanbul", "Istanbul", "istanbul", "ıstanbul" ] );
	} );

	it( "returns an array with all possible substitutions for a string with İ I i ı", function() {
		const sample = "İ I i ı";
		expect( replaceTurkishIsMemoized( sample ) ).toEqual( [
			"İ I i ı", "İ I ı i", "İ I i i", "İ I ı ı", "İ i I ı", "İ ı I i", "İ i I i", "İ ı I ı", "İ I I i", "İ I I ı",
			"İ i ı I", "İ ı i I", "İ i i I", "İ ı ı I", "İ I i I", "İ I ı I", "İ i I I", "İ ı I I", "İ I I I", "İ i ı ı",
			"İ ı i ı", "İ i i ı", "İ ı ı i", "İ i ı i", "İ ı i i", "İ i i i", "İ ı ı ı", "I İ i ı", "I İ ı i", "I İ i i",
			"I İ ı ı", "i İ I ı", "ı İ I i", "i İ I i", "ı İ I ı", "I İ I i", "I İ I ı", "i İ ı I", "ı İ i I", "i İ i I",
			"ı İ ı I", "I İ i I", "I İ ı I", "i İ I I", "ı İ I I", "I İ I I", "i İ ı ı", "ı İ i ı", "i İ i ı", "ı İ ı i",
			"i İ ı i", "ı İ i i", "i İ i i", "ı İ ı ı", "İ İ I i", "İ İ I ı", "İ İ i I", "İ İ ı I", "İ İ I I", "İ İ i ı",
			"İ İ ı i", "İ İ i i", "İ İ ı ı", "I i İ ı", "I ı İ i", "I i İ i", "I ı İ ı", "i I İ ı", "ı I İ i", "i I İ i",
			"ı I İ ı", "I I İ i", "I I İ ı", "i ı İ I", "ı i İ I", "i i İ I", "ı ı İ I", "I i İ I", "I ı İ I", "i I İ I",
			"ı I İ I", "I I İ I", "i ı İ ı", "ı i İ ı", "i i İ ı", "ı ı İ i", "i ı İ i", "ı i İ i", "i i İ i", "ı ı İ ı",
			"İ I İ i", "İ I İ ı", "İ i İ I", "İ ı İ I", "İ I İ I", "İ i İ ı", "İ ı İ i", "İ i İ i", "İ ı İ ı", "I İ İ i",
			"I İ İ ı", "i İ İ I", "ı İ İ I", "I İ İ I", "i İ İ ı", "ı İ İ i", "i İ İ i", "ı İ İ ı", "İ İ İ I", "İ İ İ i",
			"İ İ İ ı", "I i ı İ", "I ı i İ", "I i i İ", "I ı ı İ", "i I ı İ", "ı I i İ", "i I i İ", "ı I ı İ", "I I i İ",
			"I I ı İ", "i ı I İ", "ı i I İ", "i i I İ", "ı ı I İ", "I i I İ", "I ı I İ", "i I I İ", "ı I I İ", "I I I İ",
			"i ı ı İ", "ı i ı İ", "i i ı İ", "ı ı i İ", "i ı i İ", "ı i i İ", "i i i İ", "ı ı ı İ", "İ I i İ", "İ I ı İ",
			"İ i I İ", "İ ı I İ", "İ I I İ", "İ i ı İ", "İ ı i İ", "İ i i İ", "İ ı ı İ", "I İ i İ", "I İ ı İ", "i İ I İ",
			"ı İ I İ", "I İ I İ", "i İ ı İ", "ı İ i İ", "i İ i İ", "ı İ ı İ", "İ İ I İ", "İ İ i İ", "İ İ ı İ", "I i İ İ",
			"I ı İ İ", "i I İ İ", "ı I İ İ", "I I İ İ", "i ı İ İ", "ı i İ İ", "i i İ İ", "ı ı İ İ", "İ I İ İ", "İ i İ İ",
			"İ ı İ İ", "I İ İ İ", "i İ İ İ", "ı İ İ İ", "İ İ İ İ", "I i ı ı", "I ı i ı", "I i i ı", "I ı ı i", "I i ı i",
			"I ı i i", "I i i i", "I ı ı ı", "i I ı ı", "ı I i ı", "i I i ı", "ı I ı i", "i I ı i", "ı I i i", "i I i i",
			"ı I ı ı", "I I i ı", "I I ı i", "I I i i", "I I ı ı", "i ı I ı", "ı i I ı", "i i I ı", "ı ı I i", "i ı I i",
			"ı i I i", "i i I i", "ı ı I ı", "I i I ı", "I ı I i", "I i I i", "I ı I ı", "i I I ı", "ı I I i", "i I I i",
			"ı I I ı", "I I I i", "I I I ı", "i ı ı I", "ı i ı I", "i i ı I", "ı ı i I", "i ı i I", "ı i i I", "i i i I",
			"ı ı ı I", "I i ı I", "I ı i I", "I i i I", "I ı ı I", "i I ı I", "ı I i I", "i I i I", "ı I ı I", "I I i I",
			"I I ı I", "i ı I I", "ı i I I", "i i I I", "ı ı I I", "I i I I", "I ı I I", "i I I I", "ı I I I", "I I I I",
			"i ı ı ı", "ı i ı ı", "i i ı ı", "ı ı i ı", "i ı i ı", "ı i i ı", "i i i ı", "ı ı ı i", "i ı ı i", "ı i ı i",
			"i i ı i", "ı ı i i", "i ı i i", "ı i i i", "i i i i", "ı ı ı ı",
		] );

		const indicesOfAllIs = getIndicesOfCharacter( sample, "İ" ).concat(
			getIndicesOfCharacter( sample, "I" ),
			getIndicesOfCharacter( sample, "i" ),
			getIndicesOfCharacter( sample, "ı" )
		);

		expect( replaceTurkishIsMemoized( sample ).length ).toBe( Math.pow( indicesOfAllIs.length, 4 ) );
	} );
} );

describe( "a test for finding a difference between two arrays", function() {
	it( "returns an empty result if the arrays are identical", function() {
		expect( arraysDifference( [ 0, 1, 2, 3 ], [ 0, 1, 2, 3 ] ) ).toEqual( [] );
	} );

	it( "returns the first array if the second array is empty", function() {
		expect( arraysDifference( [ 0, 1, 2, 3 ], [] ) ).toEqual( [ 0, 1, 2, 3  ] );
	} );

	it( "returns the difference", function() {
		expect( arraysDifference( [ 0, 1, 2, 3 ], [ 0 ] ) ).toEqual( [ 1, 2, 3 ] );
		expect( arraysDifference( [ 0, 1, 2, 3 ], [ 0, 2 ] ) ).toEqual( [ 1, 3 ] );
		expect( arraysDifference( [ 0, 1, 2, 3 ], [ 3, 2, 1 ] ) ).toEqual( [ 0 ] );
	} );

	it( "does not bother is the second array has elements which are not in the first one", function() {
		expect( arraysDifference( [ 0, 1, 2, 3 ], [ 5 ] ) ).toEqual( [ 0, 1, 2, 3 ] );
		expect( arraysDifference( [ 0, 1, 2, 3 ], [ 1, 5 ] ) ).toEqual( [ 0, 2, 3 ] );
	} );
} );

describe( "a test for finding an overlap between two arrays", function() {
	it( "returns the first array if the arrays are identical", function() {
		expect( arraysOverlap( [ 0, 1, 2, 3 ], [ 0, 1, 2, 3 ] ) ).toEqual( [ 0, 1, 2, 3 ] );
	} );

	it( "returns an empty array if one of the input arrays is empty", function() {
		expect( arraysOverlap( [ 0, 1, 2, 3 ], [] ) ).toEqual( [] );
	} );

	it( "returns the overlap", function() {
		expect( arraysOverlap( [ 0, 1, 2, 3 ], [ 0 ] ) ).toEqual( [ 0 ] );
		expect( arraysOverlap( [ 0, 1, 2, 3 ], [ 3, 4, 5 ] ) ).toEqual( [ 3 ] );
		expect( arraysOverlap( [ 0, 1, 2, 3 ], [ 5, 1, 0 ] ) ).toEqual( [ 0, 1 ] );
	} );
} );

describe( "a test for finding indices of all words in a sentence", function() {
	it( "returns positions of the first letters of every word in the sentence", function() {
		expect( getIndicesOfWords( "I do not know what to say." ) ).toEqual( [ 0, 2, 5, 9, 14, 19, 22 ] );
		expect( getIndicesOfWords( "I do not know, what to say." ) ).toEqual( [ 0, 2, 5, 9, 15, 20, 23 ] );
		expect( getIndicesOfWords( "I do not know, what, what? what! to say." ) ).toEqual( [ 0, 2, 5, 9, 15, 21, 27, 33, 36 ] );
	} );
} );
