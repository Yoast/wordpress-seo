import imageAlt from "../../../../src/languageProcessing/helpers/image/getAlttagContent.js";

describe( "Checks for an alt tag in an image", function() {
	it( "returns the contents of the alt tag", function() {
		expect( imageAlt( "<img src='img.com' alt='a test' />" ) ).toBe( "a test" );
		expect( imageAlt( "<img src='img.com' alt='ä test' />" ) ).toBe( "ä test" );
	} );
	it( "returns empty string if there is no alt tag", function() {
		expect( imageAlt( "<img src='img.com'>" ) ).toBe( "" );
	} );
} );
