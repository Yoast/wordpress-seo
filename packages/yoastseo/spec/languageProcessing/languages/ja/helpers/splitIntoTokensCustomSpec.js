import splitIntoTokensCustom from "../../../../../src/languageProcessing/languages/ja/helpers/splitIntoTokensCustom";

const testcases = [
	{
		description: "should return an empty result sentence is empty",
		sentence: { text: "", sourceCodeRange: { startOffset: 0, endOffset: 0 } },
		expected: [],
	},
	{
		description: "should correctly tokenize a simple Japanese sentence without punctuations",
		sentence: {
			text: "犬が大好き",
			sourceCodeRange: { startOffset: 0, endOffset: 5 },
		},
		expected: [ "犬", "が", "大好き" ],
	},
	{
		description: "should correctly tokenize a Japanese sentence with Japanese punctuations",
		sentence: {
			text: "犬が大好き\u3002",
			sourceCodeRange: { startOffset: 0, endOffset: 6 },
		},
		expected: [ "犬", "が", "大好き", "。" ],

	},
	{
		description: "should correctly tokenize a Japanese sentence with English punctuations",
		sentence: {
			text: "犬が大好き.",
			sourceCodeRange: { startOffset: 0, endOffset: 6 },
		},
		expected: [ "犬", "が", "大好き", "." ],
	},
	{
		description: "should correctly tokenize a Japanese sentence with quotation marks inside",
		sentence: {
			text: "犬「が」大好き\u3002",
			sourceCodeRange: { startOffset: 0, endOffset: 8 },
		},
		expected: [ "犬", "「", "が", "」", "大好き", "。" ],
	},
	{
		description: "should correctly tokenize a Japanese sentence with quotation marks around",
		sentence: {
			text: "『犬が大好き\u3002』",
			sourceCodeRange: { startOffset: 0, endOffset: 8 },
		},
		expected: [ "『", "犬", "が", "大好き", "。", "』" ],
	},
];

describe.each( testcases )( "splitIntoTokensCustom for Japanese: %p", ( { description, sentence, expected } ) => {
	it( description, () => {
		const tokens = splitIntoTokensCustom( sentence );
		expect( tokens ).toEqual( expected );
	} );
} );
