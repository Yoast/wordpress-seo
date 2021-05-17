import getLanguage from "../../../../src/languageProcessing/helpers/language/getLanguage.js";

describe( "a function to get the language from the locale ", function() {
	it( "returns en in case of en_US", function() {
		expect( getLanguage( "en_US" ) ).toBe( "en" );
	} );
	it( "returns de in case of de_DE", function() {
		expect( getLanguage( "de_DE" ) ).toBe( "de" );
	} );
	it( "returns de in case of ar", function() {
		expect( getLanguage( "ar" ) ).toBe( "ar" );
	} );
	it( "returns empty string in case of empty locale", function() {
		expect( getLanguage( "" ) ).toBe( "" );
	} );
} );
