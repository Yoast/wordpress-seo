import {
	checkIfWordEndingIsOnExceptionList,
	checkIfWordIsOnListThatCanHavePrefix,
	checkExceptionListWithTwoStems,
} from "../../../../src/languageProcessing/helpers/morphology/exceptionListHelpers";

const prefixes = {
	prefixes1: [ "be", "ver" ],
	prefixes2: [ "uit", "on" ],
};

describe( "Returns true if a word has the same ending as one of the entries in an array", () => {
	it( "Returns true if a word has the same ending as one of the entries in an array", () => {
		expect( checkIfWordEndingIsOnExceptionList( "ziekenhuis", [ "huis", "keuken" ] ) ).toEqual( true
		);
	} );
	it( "Returns true if a word is the same as one of the entries in an array", () => {
		expect( checkIfWordEndingIsOnExceptionList( "huis", [ "huis", "keuken" ] ) ).toEqual( true
		);
	} );
	it( "Returns false if a word does not end with an entry from the array", () => {
		expect( checkIfWordEndingIsOnExceptionList( "huisarts", [ "huis", "keuken" ] ) ).toEqual( false );
	} );
	it( "Returns true if a word without prefix is on the list of words that can have a prefix", () => {
		expect( checkIfWordIsOnListThatCanHavePrefix( "zien", [ "zien", "doen" ], prefixes ) ).toEqual( true );
	} );
	it( "Returns true if a word has a prefix, and after removing the prefix the word is found on the list", () => {
		expect( checkIfWordIsOnListThatCanHavePrefix( "bezien", [ "zien", "doen" ], prefixes ) ).toEqual( true );
	} );
	it( "Returns false if a word has a prefix, and after removing the prefix the word has less than 3 characters left", () => {
		expect( checkIfWordIsOnListThatCanHavePrefix( "berg", [ "zien", "doen" ], prefixes ) ).toEqual( false );
	} );
	it( "Returns false if a word ends with an entry from the list of words that can have a prefix," +
		"but the rest of the word is not a valid prefix", () => {
		expect( checkIfWordIsOnListThatCanHavePrefix( "onvoorzien", [ "zien", "doen" ], prefixes ) ).toEqual( false );
	} );
	it( "Returns the first entry in the array if a word is on the array list with two entries", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "glaas" ) ).toEqual( "glas" );
	} );
	it( "Returns the preceding characters and the first entry in the array if a word ends in one of the entries" +
		"on the array list with two entries  ", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "bierglaas" ) ).toEqual( "bierglas" );
	} );
	it( "Returns undefined if a word is not in the array list with two entries", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "boek" ) ).toBeUndefined();
	} );
} );
