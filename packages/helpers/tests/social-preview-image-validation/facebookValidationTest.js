import { validateFacebookImage } from "../../src/index";
import { validateSize, validateType } from "../../src/social-preview-image-validation/facebookValidation";

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
} );

describe( validateSize, () => {
	const warningMessage = "Your image dimensions are not suitable. The minimum dimensions are 200x200 pixels.";

	it( "returns true when the dimensions are valid", () => {
		const testImage = { ...image, height: 100 };

		const actual = validateSize( testImage );

		const expected = warningMessage;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about: the dimensions not being suitable when the image-height is too low", () => {
		const testImage = { ...image, height: 100 };

		const actual = validateSize( testImage );

		const expected = warningMessage;

		expect( actual ).toEqual( expected );
	} );

	it( "returns a string with a warning about: the dimensions not being suitable when the image-width is too narrow", () => {
		const testImage = { ...image, width: 100 };

		const actual = validateSize( testImage );

		const expected = warningMessage;

		expect( actual ).toEqual( expected );
	} );
} );

describe( validateType, () => {
	it(	"returns true when the fileType is jpeg, gif or png", () => {
		const testImage = { ...image, type: "jpg" };

		const actual = validateType( testImage );

		const expected = true;

		expect( actual ).toEqual( expected );
	} );

	it(	"returns a string with a warning about: The uploaded image is not supported; when the fileType is not jpeg, gif or png", () => {
		const testImage = { ...image, type: "svg" };

		const actual = validateType( testImage );

		const expected = "The format of the uploaded image is not supported. The supported formats are: JPG, PNG, WEBP and GIF.";

		expect( actual ).toEqual( expected );
	} );
} );


