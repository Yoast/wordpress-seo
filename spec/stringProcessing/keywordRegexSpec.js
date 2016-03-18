var keywordRegexFunction = require( "../../js/stringProcessing/stringToRegex.js" );

describe( "creates regex from keyword", function(){
	it("returns a regex", function(){
		expect( keywordRegexFunction( "keyword" ) ).toMatch( /(^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])keyword($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])/gi );
		expect( keywordRegexFunction( "maïs" ) ).toMatch( /(^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])mais($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])/gi );
		expect( keywordRegexFunction( "Slovníček pojmû", "", false ) ).toMatch( /(^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])Slovníček pojmû($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])/gi );
	});
});
