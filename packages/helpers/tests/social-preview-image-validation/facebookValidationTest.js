import { validateFacebookImage } from "../../src/index";

const image = {
	bytes: 3,
	type: "jpg",
	height: 300,
	width: 300,
	url: "http://facebook.jpg",
	id: 34,
};

describe( validateFacebookImage, () => {
	// Test when all the values of the image object are allowed values.
	it( "returns an empty array when all the values of the image object are allowed values.", () => {
		const testImage = { ...image };

		const actual = validateFacebookImage( testImage );

		const expected = [];

		expect( actual ).toEqual( expected );
	} );

	// Image size
	it( "returns an array with a warning about: the dimensions not being suitable when the image-height is too low", () => {
		const testImage = { ...image, height: 100 };

		const actual = validateFacebookImage( testImage );

		const expected = [ "Your image dimensions are not suitable: The minimum dimensions are 200x200 pixels." ];

		expect( actual ).toEqual( expected );
	} );

	it( "returns an array with a warning about: the dimensions not being suitable when the image-width is too narrow", () => {
		const testImage = { ...image, width: 100 };

		const actual = validateFacebookImage( testImage );

		const expected = [
			"Your image dimensions are not suitable: The minimum dimensions are 200x200 pixels." ];

		expect( actual ).toEqual( expected );
	} );

	// Image type
	it(	"returns an array with a warning about: The uplaoded image is not supported; when the fileType is not jpeg, gif or png", () => {
		const testImage = { ...image, type: "svg" };

		const actual = validateFacebookImage( testImage );

		const expected = [ "The format of the uploaded image is not supported. The supported formats are: JPG, PNG and GIF." ];

		expect( actual ).toEqual( expected );
	} );
} );


