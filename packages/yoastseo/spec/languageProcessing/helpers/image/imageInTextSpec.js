import imageInText from "../../../../src/languageProcessing/helpers/image/imageInText";

describe( "Checks the text for images", function() {
	it( "returns an array with images from a text", function() {
		expect( imageInText( "<p>Here is a text with images.</p> <img src='img.com' alt='imagine1' />" +
			" <img src='img2.com' alt='image2' />" ) ).toEqual( [ "<img src='img.com' alt='imagine1' />", "<img src='img2.com' alt='image2' />" ] );
	} );
	it( "returns empty array if there are no images in the text", function() {
		expect( imageInText( "<p>Here is a text with no images.</p>" ) ).toEqual( [ ] );
	} );
} );
