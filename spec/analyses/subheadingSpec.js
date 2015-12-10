var subheadingFunction = require("../../js/analyses/subheading.js");

describe("a test for matching keywords in subheadings", function(){
	it("returns the number of matches in the subheadings", function(){
		var result = subheadingFunction( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", "keyword");
		expect( result.count ).toBe(1);
		expect( result.matches).toBe(0);
	});
});