import { removeSuffixesFromFullForm, removeSuffixFromFullForm } from "../../../../src/languageProcessing/helpers/morphology/stemHelpers";

describe( "Test to check whether a word is started with one of the words in a given list of exceptions" +
	" and ends in one of the suffixes in a given suffixes list.", () => {
	it( "deletes the suffix if a word is started with one of the words in a given list of exceptions" +
		" and ends in one of the suffixes in a given suffixes list.", () => {
		expect( removeSuffixesFromFullForm( [ "verklaard", "beteuterd", "gehumeurd", "gesmoord" ],
			[ "er", "ers", "ere" ], "verklaardere" ) ).toEqual( "verklaard" );
	} );

	it( "returns undefined if the word doesn't start with one of the words in a given list.", () => {
		expect( removeSuffixesFromFullForm( [ "verklaard", "beteuterd", "gehumeurd", "gesmoord" ],
			[ "er", "ers", "ere" ], "residuen" ) ).toBeUndefined();
	} );
} );

describe( "Test to check whether a word ends in one of the word on a given list of exceptions.", () => {
	it( "deletes the suffix if a word is in a given list of exceptions.", () => {
		expect( removeSuffixFromFullForm( [  "individuen", "parvenuen", "residuen" ],
			"en", "individuen" ) ).toEqual( "individu" );
	} );

	it( "deletes the suffix if a word is in a given list of exceptions.", () => {
		expect( removeSuffixFromFullForm( [  "zeges", "modes" ],
			"s", "retromodes" ) ).toEqual( "retromode" );
	} );

	it( "returns undefined if a word is not on a given list of exceptions.", () => {
		expect( removeSuffixFromFullForm( [  "zeges", "modes" ],
			"s", "sites" ) ).toBeUndefined();
	} );
} );
