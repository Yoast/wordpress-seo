var getLanguage = require( "../../js/helpers/getLanguage.js" );

describe("a function to get the language from the locale ", function(){
	it("returns en in case of en_US", function(){
		expect( getLanguage( 'en_US' ) ).toBe( 'en' );
	});
	it("returns de in case of de_DE", function(){
		expect( getLanguage( 'de_DE' ) ).toBe( 'de' );
	});
});
