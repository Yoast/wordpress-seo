var urlLength = require( "../../js/analyses/urlLength.js" );

describe("Checks length of Url", function(){
	it("returns boolean", function(){
		expect( urlLength("new-very-very-very-very-very-very-lengthy-url", "keyword", 20, 40)).toBe(true);
		expect( urlLength("url", "keyword", 20, 40)).toBe(false);
		expect( urlLength("a-lengthy-url", "key", 5, 5)).toBe(true);
	});
});
