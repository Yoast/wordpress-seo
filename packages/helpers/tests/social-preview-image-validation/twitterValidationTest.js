import { validateTwitterImage } from "../../src/index";

const image = {
	bytes: 5,
	type: "jpg",
	height: 250,
	width: 250,
	url: "http://twitter.jpg",
	id: 34,
};

describe( validateTwitterImage, () => {
	// Test when all the values of the image object are allowed values.
	it( "returns an empty array when all the values of the image object are allowed values.", () => {
		const testImage = { ...image };

		const actual = validateTwitterImage( testImage );

		const expected = [];

		expect( actual ).toEqual( expected );
	} );

	// Image size
	it( "returns an array with a warning about: the dimensions not being suitable when the image-height is too high", () => {
		const testImage = { ...image, height: 100 };

		const actual = validateTwitterImage( testImage );

		const expected = [
			"Your image dimensions are not suitable: The minimum dimensions are 200x200 pixels. " +
		"The maximum dimensions are 4096x4096 pixels." ];

		expect( actual ).toEqual( expected );
	} );

	it( "returns an array with a warning about: the dimensions not being suitable when the image-height is too low", () => {
		const testImage = { ...image, height: 5000 };

		const actual = validateTwitterImage( testImage );

		const expected = [
			"Your image dimensions are not suitable: The minimum dimensions are 200x200 pixels. " +
		"The maximum dimensions are 4096x4096 pixels." ];

		expect( actual ).toEqual( expected );
	} );

	it( "returns an array with a warning about: the dimensions not being suitable when the image-width is too wide ", () => {
		const testImage = { ...image, width: 5000 };

		const actual = validateTwitterImage( testImage );

		const expected = [
			"Your image dimensions are not suitable: The minimum dimensions are 200x200 pixels. " +
		"The maximum dimensions are 4096x4096 pixels." ];

		expect( actual ).toEqual( expected );
	} );

	it( "returns an array with a warning about: the dimensions not being suitable when the image-width is too narrow", () => {
		const testImage = { ...image, width: 100 };

		const actual = validateTwitterImage( testImage );

		const expected = [
			"Your image dimensions are not suitable: The minimum dimensions are 200x200 pixels. " +
		"The maximum dimensions are 4096x4096 pixels." ];

		expect( actual ).toEqual( expected );
	} );

	// Image type
	it( "returns an array with a warning about: uploaded gif, will use the first frame; when the fileType is 'gif' ", () => {
		const testImage = { ...image, type: "gif" };

		const actual = validateTwitterImage( testImage );

		const expected = [ "You have uploaded a GIF. Please note that, if it’s an animated GIF, only the first frame will be used." ];

		expect( actual ).toEqual( expected );
	} );

	it(	"returns an array with a warning about: The uplaoded image is not supported; when the fileType is not jpeg, gif, png or webp ", () => {
		const testImage = { ...image, type: "svg" };

		const actual = validateTwitterImage( testImage );

		const expected = [ "The format of the uploaded image is not supported. The supported formats are: JPG, PNG, WEBP and GIF." ];

		expect( actual ).toEqual( expected );
	} );

	// Image bytes
	it( "returns an array with a warning about the file size being too large; when the bytes are more than 5MB", () => {
		const testImage = { ...image, bytes: 6 };

		const actual = validateTwitterImage( testImage );

		const expected = [ "The file size of the uploaded image is too large for Twitter. File size must be less than 5MB." ];

		expect( actual ).toEqual( expected );
	} );
} );


