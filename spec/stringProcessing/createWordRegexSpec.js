var createWordRegex = require( "../../js/stringProcessing/createWordRegex.js" );

describe( "creates regex from keyword", function(){
	it("returns a regex", function(){
		expect( createWordRegex( "keyword" ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])keyword($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
	});
	it("returns a regex - words with diacritics", function(){
		expect( createWordRegex( "maïs", "", false ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])maïs($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
		expect( createWordRegex( "Slovníček pojmû", "", false ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])Slovníček pojmû($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
	});
	it("returns a regex - words with characters that break regexes", function(){
		expect( createWordRegex( "keyword*" ) ).toEqual( /(^|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])keyword\*($|[ \n\r\t.,'()"+-;!?:\/»«‹›<>])/gi );
	});
});
