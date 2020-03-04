import { checkIfWordEndingIsOnExceptionList, checkExceptionListWithTwoStems } from "../../../src/morphology/morphoHelpers/exceptionListHelpers";

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
	it( "Returns true if a word is in the array list with two stems", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "glaas" ) ).toEqual( "glas" );
	} );
	it( "Returns true if a word ends in an entry of the array list with two stems", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "bierglaas" ) ).toEqual( "bierglas" );
	} );
	it( "Returns false if a word is not in the array list with two stems", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "boek" ) ).toBeUndefined();
	} );
} );
