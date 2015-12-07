var imageAlt = require( "../../js/stringProcessing/imageAlttags.js" );

describe("Checks for alttag in an image", function(){
	it("returns the contents of the alttag", function(){
		expect( imageAlt( "<img src='img.com' alt='a test' />" ) ).toBe('a test');
		expect( imageAlt( "<img src='img.com' alt='ä test' />" ) ).toBe('ä test');
	});
});
