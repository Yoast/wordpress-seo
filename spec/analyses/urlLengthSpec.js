var urlLength = require( "../../js/analyses/getUrlLength.js" );

describe("Checks length of Url", function(){
	it("returns boolean", function(){
		expect( urlLength("new-very-very-very-very-very-very-lengthy-url", "keyword")).toBe(true);
		expect( urlLength("url", "keyword")).toBe(false);
	});
});
