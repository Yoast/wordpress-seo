var addWordBoundary = require( "../../js/stringProcessing/addWordboundary.js" );

describe("a test adding wordboundaries to a string", function(){
	it("adds start and end boundaries", function(){
		expect( addWordBoundary( "keyword" ) ).toBe( "(^|[ \n\r\t\.,'\(\)\"\+\-;!?:\/<>])keyword($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/<>])" );
	});
});