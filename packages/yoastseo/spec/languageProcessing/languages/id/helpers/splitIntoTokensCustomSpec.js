import splitIntoTokensCustom from "../../../../../src/languageProcessing/languages/id/helpers/splitIntoTokensCustom";

const splitIntoTokensTestCases = [
	{
		description: "should return an empty array if the sentence is empty",
		sentence: "",
		expectedTokens: [],
	},
	{
		description: "should correctly tokenize a sentence with a single token",
		sentence: "Halo",
		expectedTokens: [ "Halo" ],
	},
	{
		description: "should correctly tokenize a sentence with a single token and a trailing whitespace",
		sentence: "Halo ",
		expectedTokens: [ "Halo", " " ],
	},
	{
		description: "should correctly tokenize a sentence with a single token and a leading whitespace",
		sentence: " Halo",
		expectedTokens: [ " ", "Halo" ],
	},
	{
		description: "should correctly tokenize a sentence with multiple tokens ending with a full stop",
		sentence: "Halo, kucing.",
		expectedTokens: [ "Halo", ",", " ", "kucing", "." ],
	},
	{
		description: "should correctly tokenize a sentence with multiple tokens ending with a full stop and a trailing whitespace",
		sentence: "Halo, kucing. ",
		expectedTokens: [ "Halo", ",", " ", "kucing", ".", " " ],
	},
	{
		description: "should correctly tokenize a sentence with multiple punctuation marks",
		sentence: "Halo, kucing!!!",
		expectedTokens: [ "Halo", ",", " ", "kucing", "!", "!", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with multiple different punctuation marks",
		sentence: "Halo, kucing!?!",
		expectedTokens: [ "Halo", ",", " ", "kucing", "!", "?", "!" ],
	},
	{
		description: "should not split words on hyphens",
		sentence: "Halo, kucing-kucing!",
		expectedTokens: [ "Halo", ",", " ", "kucing-kucing", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a word containing an underscore",
		sentence: "Halo, kucing_kucing!",
		expectedTokens: [ "Halo", ",", " ", "kucing_kucing", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a word containing a forward slash",
		sentence: "Halo, kucing/kucing!",
		expectedTokens: [ "Halo", ",", " ", "kucing", "/", "kucing", "!" ],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence with a word containing a backslash",
		sentence: "Halo, kucing\\kucing!",
		expectedTokens: [ "Halo", ",", " ", "kucing", "\\", "kucing", "!" ],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence with a word containing an apostrophe",
		sentence: "Dia 'kan kusurati.",
		expectedTokens: [ "Dia", " ", "'", "kan", " ", "kusurati", "." ],
	},
	{
		description: "should correctly tokenize a sentence with a number with a decimal point",
		sentence: "Halo, 3.14!",
		expectedTokens: [ "Halo", ",", " ", "3.14", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a number with a decimal comma",
		sentence: "Halo, 3,14!",
		expectedTokens: [ "Halo", ",", " ", "3,14", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a token that starts with a punctuation mark",
		sentence: "Halo, .kucing!",
		expectedTokens: [ "Halo", ",", " ", ".", "kucing", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a token between parentheses",
		sentence: "Halo, (kucing)!",
		expectedTokens: [ "Halo", ",", " ", "(", "kucing", ")", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a phrase between parentheses",
		sentence: "Halo, (kucing dan anjing)!",
		expectedTokens: [ "Halo", ",", " ", "(", "kucing", " ", "dan", " ", "anjing", ")", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with nested parentheses",
		sentence: "Halo, (kucing (dan anjing))!",
		expectedTokens: [ "Halo", ",", " ", "(", "kucing", " ", "(", "dan", " ", "anjing", ")", ")", "!" ],
	},
	{
		description: "should correctly tokenize a sentence containing an url",
		sentence: "Halo, https://www.google.com!",
		expectedTokens: [ "Halo", ",", " ", "https://www.google.com", "!" ],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence containing an email address",
		sentence: "Halo, hugo@yoast.com!",
		expectedTokens: [ "Halo", ",", " ", "hugo@yoast.com", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a nbsp",
		sentence: "Halo,\u00A0kucing!",
		expectedTokens: [ "Halo", ",", "\u00A0", "kucing", "!" ],
	},
	{
		description: "should correctly tokenize a sentence where a punctuation mark is between two spaces",
		sentence: "Halo , kucing!",
		expectedTokens: [ "Halo", " ", ",", " ", "kucing",  "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a token that contains a number",
		sentence: "Halo, 123kucing!",
		expectedTokens: [ "Halo", ",", " ", "123kucing", "!" ],
	},
	{
		description: "should correctly tokenize a sentence with a token that contains an abbreviation",
		sentence: "Halo, K.U.C.I.N.G.!",
		expectedTokens: [ "Halo", ",", " ", "K.U.C.I.N.G.", "!" ],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence with a token that contains an emoji",
		sentence: "Halo, 🌍!",
		expectedTokens: [ "Halo", ",", " ", "🌍", "!" ],
	},
	{
		description: "should correctly tokenize a sentence that contains multiple consecutive spaces",
		sentence: "Halo,   kucing!",
		expectedTokens: [ "Halo", ",", " ", " ", " ", "kucing", "!" ],
	},
];

describe.each( splitIntoTokensTestCases )( "A test for the tokenize method", ( { description, sentence, expectedTokens, skip } ) => {
	const test = skip ? it.skip : it;

	test( description, function() {
		const tokens = splitIntoTokensCustom( sentence );
		expect( tokens ).toEqual( expectedTokens );
	} );
} );
