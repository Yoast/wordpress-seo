import isDoubleQuoted from "../../../../src/languageProcessing/helpers/match/isDoubleQuoted";
import doubleQuotes from "../../../../src/languageProcessing/helpers/sanitize/doubleQuotes";
import sample from "lodash";

const testCases = [
	{
		description: "returns true for double quoted keyphrase",
		keyphrase: "\"keyphrase\"",
		expectedResult: true,
	},
	{
		description: "returns false for non-double quoted keyphrase",
		keyphrase: "keyphrase",
		expectedResult: false,
	},
	{
		description: "returns true for empty double quoted keyphrase",
		keyphrase: "\"\"",
		expectedResult: true,
	},
	{
		description: "returns false for single quoted keyphrase",
		keyphrase: "'keyphrase'",
		expectedResult: false,
	},
	{
		description: "returns true for any combination of double quotes",
		keyphrase: `${ sample( doubleQuotes ) }keyphrase${ sample( doubleQuotes ) }`,
		expectedResult: true,
	},
	{
		description: "returns false if only starts with a double quote",
		keyphrase: "\"keyphrase",
		expectedResult: false,
	},
	{
		description: "returns false if only ends with a double quote",
		keyphrase: "keyphrase\"",
		expectedResult: false,
	},
];

describe.each( testCases )( "isDoubleQuoted", (
	{ description, keyphrase, expectedResult } ) => {
	it( description, () => {
		expect( isDoubleQuoted( keyphrase ) ).toBe( expectedResult );
	} );
} );
