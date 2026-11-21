import { validateTwitterImage } from "../../src/index";
import { validatesBytes, validateType, validateSize } from "../../src/social-preview-image-validation/twitterValidation";

const image = {
	bytes: 4,
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
} );

describe( validateSize, () => {
	const warningLargeCard = "Your image dimensions are not suitable. The minimum dimensions are 300x157 pixels. " +
"The maximum dimensions are 4096x4096 pixels.";

	const warningSmallCard = "Your image dimensions are not suitable. The minimum dimensions are 200x200 pixels. " +
"The maximum dimensions are 4096x4096 pixels.";

	it( "returns true when the image dimensions are valid", () => {
		const testImage = { ...image, width: 300, height: 300 };

		const actual = 	validateSize( testImage, false );

		const expected = true;

		expect( actual ).toEqual( expected );
	} );
	// Summary card
	it( "returns a string about :the dimensions not being suitable when the image-height is too high", () => {
		const testImage = { ...image, height: 100 };

		const actual = 	validateSize( testImage, false );

		const expected = warningSmallCard;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about: the dimensions not being suitable when the image-height is too low", () => {
		const testImage = { ...image, height: 5000 };

		const actual = validateSize( testImage, false );

		const expected = warningSmallCard;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about: the dimensions not being suitable when the image-width is too wide ", () => {
		const testImage = { ...image, width: 5000 };

		const actual = validateSize( testImage, false );

		const expected = warningSmallCard;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about: the dimensions not being suitable when the image-width is too narrow", () => {
		const testImage = { ...image, width: 100 };

		const actual = validateSize( testImage, false );

		const expected = warningSmallCard;

		expect( actual ).toEqual( expected );
	} );
	// Summary_large_image card
	it( "returns a string with a warning about: the dimensions not being suitable when the image-width is too narrow", () => {
		const testImage = { ...image, width: 100 };

		const actual = validateSize( testImage, true );

		const expected = warningLargeCard;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about: the dimensions not being suitable when the image-width is too narrow", () => {
		const testImage = { ...image, width: 100 };

		const actual = validateSize( testImage, true );

		const expected = warningLargeCard;

		expect( actual ).toEqual( expected );
	} );
} );


describe( validateType, () => {
	it( "returns true when the fileType is jpg, png or webp", () => {
		const testImage = { ...image };

		const actual = validateType( testImage );

		const expected = true;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about: uploaded gif, will use the first frame; when the fileType is 'gif' ", () => {
		const testImage = { ...image, type: "gif" };

		const actual = validateType( testImage );

		const expected = "You have uploaded a GIF. Please note that, if it’s an animated GIF, only the first frame will be used.";

		expect( actual ).toEqual( expected );
	} );

	it(	"returns a string with a warning about: The uploaded image is not supported; when the fileType is not jpg, gif, png or webp ", () => {
		const testImage = { ...image, type: "svg" };

		const actual = validateType( testImage );

		const expected = "The format of the uploaded image is not supported. The supported formats are: JPG, PNG, WEBP and GIF.";

		expect( actual ).toEqual( expected );
	} );
} );

describe( validatesBytes, () => {
	it( "returns true when the bytes are less than 5MB", () => {
		const testImage = { ...image, bytes: 4 };

		const actual = validatesBytes( testImage );

		const expected = true;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about the file size being too large; when the bytes are more than 5MB", () => {
		const testImage = { ...image, bytes: 6 };

		const actual = validatesBytes( testImage );

		const expected = "The file size of the uploaded image is too large for X. File size must be less than 5MB.";

		expect( actual ).toEqual( expected );
	} );
} );


