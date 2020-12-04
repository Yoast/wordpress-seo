import { buildOneFormFromRegex } from "../../../../src/languageProcessing/helpers/morphology/buildFormRule";

const regexes = [
	{ reg: new RegExp( "([^v])ies$" ), repl: "$1y" },
	{ reg: new RegExp( "nn$" ), repl: "n" },
];

describe( "Checks if the input word qualifies for the input regex and if so builds a required form.", () => {
	it( "Checks if the input word qualifies for the input regex and if so builds a required form.", () => {
		expect( buildOneFormFromRegex( "mann", regexes ) ).toBe( "man" );
		expect( buildOneFormFromRegex( "butterflies", regexes ) ).toBe( "butterfly" );
	} );
} );
