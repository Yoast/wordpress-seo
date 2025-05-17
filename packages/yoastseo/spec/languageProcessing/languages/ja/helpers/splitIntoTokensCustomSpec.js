import splitIntoTokensCustom from "../../../../../src/languageProcessing/languages/ja/helpers/splitIntoTokensCustom";

const testcases = [
	{
		description: "should return an empty result sentence is empty",
		sentenceText: "",
		expected: [],
	},
	{
		description: "should correctly tokenize a simple Japanese sentence without punctuations",
		sentenceText: "犬が大好き",
		expected: [ "犬", "が", "大好き" ],
	},
	{
		description: "should correctly tokenize a Japanese sentence with Japanese punctuations",
		sentenceText: "犬が大好き\u3002",
		expected: [ "犬", "が", "大好き", "。" ],

	},
	{
		description: "should correctly tokenize a Japanese sentence with English punctuations",
		sentenceText: "犬が大好き.",
		expected: [ "犬", "が", "大好き", "." ],
	},
	{
		description: "should correctly tokenize a Japanese sentence with quotation marks inside",
		sentenceText: "犬「が」大好き\u3002",
		expected: [ "犬", "「", "が", "」", "大好き", "。" ],
	},
	{
		description: "should correctly tokenize a Japanese sentence with quotation marks around",
		sentenceText: "『犬が大好き\u3002』",
		expected: [ "『", "犬", "が", "大好き", "。", "』" ],
	},
];

describe.each( testcases )( "splitIntoTokensCustom for Japanese: %p", ( { description, sentenceText, expected } ) => {
	it( description, () => {
		const tokens = splitIntoTokensCustom( sentenceText );
		expect( tokens ).toEqual( expected );
	} );
} );
