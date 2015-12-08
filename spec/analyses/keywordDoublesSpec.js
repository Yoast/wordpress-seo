var keywordDoubles = require( "../../js/analyses/keywordDoubles.js" );

var usedKeywords = { "keyword": [1], "test": [2,3,4] };

describe( "checks for keyword doubles", function(){
	it("returns array with keyword", function(){
		expect( keywordDoubles( "keyword", usedKeywords ).count).toBe(1);
		expect( keywordDoubles( "keyword", usedKeywords ).id).toBe(1);
		expect( keywordDoubles( "test", usedKeywords ).count).toBe(3);
		expect( keywordDoubles( "test", usedKeywords ).id).toBe(undefined);

	});
});
