var stripSomeTags = require("../../js/stringProcessing/stripSomeTags.js");

describe("a test for removing the tags from a given text", function(){
	it("returns a text without tags, except h1-6, li, dd and p", function(){
		expect( stripSomeTags( "<p>a textstring</p>" )).toBe( "<p>a textstring</p>" );
		expect( stripSomeTags( "<div class='divje'>this is text</div>" )).toBe( "this is text" );
		expect( stripSomeTags( "<p><strong>this is text</strong></p>" )).toBe( "<p>this is text</p>" );
	});
});