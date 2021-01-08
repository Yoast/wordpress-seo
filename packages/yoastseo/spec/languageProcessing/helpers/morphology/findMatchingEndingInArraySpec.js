import { findMatchingEndingInArray } from "../../../../src/languageProcessing/helpers/morphology/findMatchingEndingInArray";

describe( "Test for matching a word to an array of regex(es) and returning the longest ending that was matched at the end of the string", () => {
	it( "returns the longest ending that was matched at the end of the string", () => {
		const regexes = [ "yend", "yendo", "endo" ];
		expect( findMatchingEndingInArray( "excluyendo", regexes ) ).toEqual( "yendo" );
	} );

	it( "returns an empty string if no match is found", () => {
		const regexes = [ "yend", "yendo", "endo" ];
		expect( findMatchingEndingInArray( "atribuyes", regexes ) ).toEqual( "" );
	} );
} );
