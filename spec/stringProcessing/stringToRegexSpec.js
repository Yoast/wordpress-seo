var stringToRegex = require( "../../js/stringProcessing/stringToRegex.js" );

describe( "creates regex from keyword", function(){
	it("returns a regex", function(){
		expect( stringToRegex( "keyword" ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])keyword($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
	});
	it("returns a regex - words with diacritics", function(){
		expect( stringToRegex( "maïs", "", false ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])maïs($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
		expect( stringToRegex( "Slovníček pojmû", "", false ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])Slovníček pojmû($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
	});
	it("returns a regex - words with characters that break regexes", function(){
		expect( stringToRegex( "keyword*" ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])keyword\*($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
	});
});
