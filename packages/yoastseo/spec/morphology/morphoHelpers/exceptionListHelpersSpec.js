import { checkIfWordEndingIsOnExceptionList, checkIfWordIsOnVerbExceptionList, checkExceptionListWithTwoStems } from "../../../src/morphology/morphoHelpers/exceptionListHelpers";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

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
	it( "Returns true if a word is on the verb exception list", () => {
		expect( checkIfWordIsOnVerbExceptionList( "zien", [ "zien", "doen" ], morphologyDataNL.verbs.compoundVerbsPrefixes ) ).toEqual( true );
	} );
	it( "Returns true if a word has an inseparable verb prefix, and after removing the prefix the word is found on the verb exception list", () => {
		expect( checkIfWordIsOnVerbExceptionList( "bezien", [ "zien", "doen" ], morphologyDataNL.verbs.compoundVerbsPrefixes ) ).toEqual( true );
	} );
	it( "Returns true if a word has an separable verb prefix, and after removing the prefix the word is found on the verb exception list", () => {
		expect( checkIfWordIsOnVerbExceptionList( "uitzien", [ "zien", "doen" ], morphologyDataNL.verbs.compoundVerbsPrefixes ) ).toEqual( true );
	} );
	it( "Returns false if a word ends with an entry from the verb exception list, but the rest of the word is not a verb prefix", () => {
		expect( checkIfWordIsOnVerbExceptionList( "onvoorzien", [ "zien", "doen" ], morphologyDataNL.verbs.compoundVerbsPrefixes ) ).toEqual( false );
	} );
	it( "Returns the canonical stem if a word is in the array list with two stems", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "glaas" ) ).toEqual( "glas" );
	} );
	it( "Returns the canonical stem for compound words (if a word ends in an entry of the array list with two stems)", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "bierglaas" ) ).toEqual( "bierglas" );
	} );
	it( "Returns undefined if a word is not in the array list with two stems", () => {
		expect( checkExceptionListWithTwoStems( [ [ "glas", "glaas" ], [ "vat", "vaat" ] ], "boek" ) ).toBeUndefined();
	} );
} );
