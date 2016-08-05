var getLanguageAvailability = require( "../../js/helpers/getLanguageAvailability.js" );
describe( "checks is a language is available, based on locale and a given list", function() {

	it( "Returns true when a language is available", function() {
		var locale = "en_US";
		expect( getLanguageAvailability( locale, [ "en" ] ) ).toBe( true );
		expect( getLanguageAvailability( locale, [ "nl", "de", "en" ] ) ).toBe( true );
	} );
	it( "Returns false when a language isn't available", function() {
		var locale = "en_US";
		expect( getLanguageAvailability( locale, [ "nl" ] ) ).toBe( false );
		expect( getLanguageAvailability( locale, [ "nl", "de", "fr" ] ) ).toBe( false );
	} );

	it( "Returns true when a language is available with a partial locale", function() {
		var locale = "en";
		expect( getLanguageAvailability( locale, [ "en" ] ) ).toBe( true );
		expect( getLanguageAvailability( locale, [ "en", "de", "fr" ] ) ).toBe( true );
	} );

	it( "Returns false when an empty locale is passed", function() {
		var locale = "";
		expect( getLanguageAvailability( locale, [ "en" ] ) ).toBe( false );
		expect( getLanguageAvailability( locale, [ "en", "de", "fr" ] ) ).toBe( false );
	} );
} );
