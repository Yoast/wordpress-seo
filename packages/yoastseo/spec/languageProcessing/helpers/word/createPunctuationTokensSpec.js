import createPunctuationTokens from "../../../../src/languageProcessing/helpers/word/createPunctuationTokens";

const testCases = [
	{
		description: "returns the same array when there's no punctuation or hashed HTML entities at the beginning or end of a word token",
		rawTokens: [ "2", "+", "2", "is", "4" ],
		expectedResult: [ "2", "+", "2", "is", "4" ],
	},
	{
		description: "moves a comma and a full stop at the end of a word into a separate token",
		rawTokens: [ "This", " ", "is", " ", "a", " ", "simple", " ", "sentence,", " ", "with", " ", "a", " ", "comma." ],
		expectedResult: [ "This", " ", "is", " ", "a", " ", "simple", " ", "sentence", ",", " ", "with", " ", "a", " ", "comma", "." ],
	},
	{
		description: "doesn't move punctuation that's in the middle of a word",
		rawTokens: [ "a", " ", "phrase", " ", "with", " ", "an", " ", "apostrophe's" ],
		expectedResult: [ "a", " ", "phrase", " ", "with", " ", "an", " ", "apostrophe's" ],
	},
	{
		description: "moves quotes from the beginning and end of a word",
		rawTokens: [ "\"a", " ", "phrase", " ", "between", " ", "quotes\"" ],
		expectedResult: [ "\"", "a", " ", "phrase", " ", "between", " ", "quotes", "\"" ],
	},
	{
		description: "moves parentheses from the beginning and end of a word",
		rawTokens: [ "(a", " ", "phrase", " ", "between", " ", "parentheses)" ],
		expectedResult: [ "(", "a", " ", "phrase", " ", "between", " ", "parentheses", ")" ],
	},
	{
		description: "doesn't move a hashed HTML entity (in this case, '#trade;' for '™') in the beginning or the end of the word",
		rawTokens: [ "one", " ", "trademark#trade;", ",", " ", "and", " ", "another", " ", "'", "#trade;trademark", "'" ],
		expectedResult: [ "one", " ", "trademark#trade;", ",", " ", "and", " ", "another", " ", "'", "#trade;trademark", "'" ],
	},
];

describe.each( testCases )( "createPunctuationTokens", ( { description, rawTokens, expectedResult } ) => {
	it( description, () => {
		expect( createPunctuationTokens( rawTokens ) ).toEqual( expectedResult );
	} );
} );
