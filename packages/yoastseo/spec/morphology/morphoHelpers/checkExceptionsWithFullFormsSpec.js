import checkExceptionsWithFullForms  from "../../../src/morphology/morphoHelpers/checkExceptionsWithFullForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Test for getting the correct stem from full forms exception lists", () => {
	it( "return the correct stem of a word from the ending match full forms list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "stadje" ) ).toEqual( "stad" );
	} );
	it( "return the correct stem of a compound word which ends with a word from the ending match full forms list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "hoofdsteden" ) ).toEqual( "hoofdstad" );
	} );
	it( "returns null if a word ends with a word from the ending match full forms list (eis), but the preceding lexical material" +
		"is only one character", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "reis" ) ).toEqual( null );
	} );
	it( "return the correct stem of a word from the exact match full forms list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "kaden" ) ).toEqual( "ka" );
	} );
	it( "return null if the word ends with a word from the exact match full forms list (ka)", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "ska" ) ).toEqual( null );
	} );
	it( "return the correct stem of a verb from the verb full forms list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "weten" ) ).toEqual( "weet" );
	} );
	it( "return the correct stem of a compound verb ending with a verb from the verb full forms list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "afweten" ) ).toEqual( "afweet" );
	} );
	it( "return null if the word ends with a verb from the verb full forms list, but the preceding lexical material is not" +
		"a verb prefix from the list of inseparable and separable compound verb prefixes", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "zweten" ) ).toEqual( null );
	} );
	it( "returns null if the word checked is not in any of the full forms exception lists", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL, "plant" ) ).toEqual( null );
	} );
} );
