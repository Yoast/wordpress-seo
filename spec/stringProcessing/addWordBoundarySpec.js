// var addWordBoundary = require( "../../js/stringProcessing/addWordboundary.js" );

import addWordBoundary from "../../js/stringProcessing/addWordboundary";

describe("a test adding wordboundaries to a string", function(){
	it("adds start and end boundaries", function(){
		expect( addWordBoundary( "keyword" ) ).toBe( "(^|[ \\u00a0 \\n\\r\\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])keyword($|[ \\u00a0 \\n\\r\\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])" );
		expect( addWordBoundary( "keyword", "extra" ) ).toBe( "(^|[ \\u00a0 \\n\\r\\t\.,'\(\)\"\+\-;!?:\/»«‹›extra<>])keyword($|[ \\u00a0 \\n\\r\\t\.,'\(\)\"\+\-;!?:\/»«‹›extra<>])" );
	});
});
