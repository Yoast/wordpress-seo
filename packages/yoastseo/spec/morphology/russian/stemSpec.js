import stem from "../../../src/morphology/russian/stem";

// The first word in each array is the word, the second one is the expected stem.

const wordsToStem = [
	// Words with perfective gerund suffix.
	[ "прочитав", "прочита" ],
	// Words with noun suffixes
	[ "за́писей", "за́пис" ],
	[ "за́писями", "за́пис" ],
	// Words with verb suffixes
	[ "читаете", "чита" ],
	// Words with adjective suffixes
	[ "большой", "больш" ],
	[ "синий", "син" ],
	// Words with participle suffixes
	[ "встречавшем", "встречавш" ],
	// Words with reflexive suffixes
	[ "вымыться", "вымыть" ],
	[ "оденусь", "одену" ],
	// Words with superlative suffixes
	[ "труднейш", "трудн" ],
	[ "глупейше", "глуп" ],
	// Words with derivational suffixes
	[ "чистость", "чист" ],
];


describe( "Test for stemming russian words", () => {
	it( "stems russian words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
