var arrayToRegex = require( "../../js/stringProcessing/createRegexFromArray.js" );

describe("a test creating a regex from an array with strings", function(){
	it("adds start and end boundaries", function(){
		expect( arrayToRegex( ["a","b","c"] ) ).toMatch("/((^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])a($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>]))|((^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])b($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>]))|((^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])c($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>]))/gi");
	});
});
