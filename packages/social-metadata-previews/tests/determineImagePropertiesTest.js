/* Internal dependencies */
import * as determineImageProperties from "../src/helpers/determineImageProperties";

describe( "determineImageMode", () => {
	it( "Facebook preview returns square when the width and height are the same", () => {
		const actual = determineImageProperties.determineImageMode(
			"Facebook",
			{ width: 300, height: 300 } );
		const expected = "square";

		expect( actual ).toEqual( expected );
	} );

	it( "Facebook preview returns portrait when the height is greater than the width", () => {
		const actual = determineImageProperties.determineImageMode(
			"Facebook",
			{ width: 300, height: 600 } );
		const expected = "portrait";

		expect( actual ).toEqual( expected );
	} );

	it( "Facebook preview returns portrait when the width is greater than the height", () => {
		const actual = determineImageProperties.determineImageMode(
			"Facebook",
			{ width: 600, height: 300 } );
		const expected = "landscape";

		expect( actual ).toEqual( expected );
	} );

	it( "Twitter preview returns landscape when width > 280 and height > 150", () => {
		const actual = determineImageProperties.determineImageMode(
			"Twitter",
			{ width: 300, height: 300 } );
		const expected = "landscape";

		expect( actual ).toEqual( expected );
	} );

	it( "Twitter preview returns square when both width < 280 and height < 150", () => {
		const actual = determineImageProperties.determineImageMode(
			"Twitter",
			{ width: 200, height: 100 } );
		const expected = "square";

		expect( actual ).toEqual( expected );
	} );

	it( "Twitter preview returns square when either width < 280 or height < 150", () => {
		const actual = determineImageProperties.determineImageMode(
			"Twitter",
			{ width: 300, height: 100 } );
		const expected = "square";

		expect( actual ).toEqual( expected );
	} );
} );

describe( "retrieveExpectedDimensions", () => {
	it( "returns Twitter image sizes when SocialMedium is set to 'Twitter'", () => {
		const actual = determineImageProperties.retrieveExpectedDimensions("Twitter", );
		const expected = {
			squareWidth: 123,
			squareHeight: 123,
			landscapeWidth: 506,
			landscapeHeight: 253,
		};

		expect( actual ).toEqual( expected );
	} );

	it( "returns Facebook image sizes when SocialMedium is set to 'Facebook'", () => {
		const actual = determineImageProperties.retrieveExpectedDimensions("Facebook", );
		const expected = {
			squareWidth: 158,
			squareHeight: 158,
			landscapeWidth: 500,
			landscapeHeight: 261,
			portraitWidth: 158,
			portraitHeight: 236,
		};

		expect( actual ).toEqual( expected );
	} );
} );

describe( "calculateImageRatios", () => {
	it( "returns the widthRatio and heightRatio for a Facebook image in portrait mode", () => {
		const actual = determineImageProperties.calculateImageRatios(
			determineImageProperties.FACEBOOK_IMAGE_SIZES,
			{ width: 316, height: 472 },
			"portrait" );
		/*
		* Expected widthRatio is 2, because 316 is divided by 158, Facebook's width for portrait images.
		* Same idea for expected heightRatio.
		 */
		const expected = { widthRatio: 2, heightRatio: 2 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the widthRatio and heightRatio for a Facebook image in landscape mode", () => {
		const actual = determineImageProperties.calculateImageRatios(
			determineImageProperties.FACEBOOK_IMAGE_SIZES,
			{ width: 600, height: 522 },
			"landscape" );
		const expected = { widthRatio: 1.2, heightRatio: 2 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the widthRatio and heightRatio for a Twitter image in square mode", () => {
		const actual = determineImageProperties.calculateImageRatios(
			determineImageProperties.TWITTER_IMAGE_SIZES,
			{ width: 246, height: 246 },
			"square" );
		const expected = { widthRatio: 2, heightRatio: 2 };

		expect( actual ).toEqual( expected );
	} );
} );

describe( "calculateLargestDimensions", () => {
	it( "returns the width and height for an image for which the widthRatio is greater than the heightRatio", () => {
		const actual = determineImageProperties.calculateLargestDimensions(
			{ width: 240, height: 480 },
			{ widthRatio: 1.5, heightRatio: 1.2 } );
		/*
		* Expected height is 400, because the original height (480) is divided by the smallest of
		* the two imageRatios (1.2). Same idea for expected width.
		 */
		const expected = { height: 400, width: 200 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the width and height for an image for which the widthRatio and heightRatio are the same", () => {
		const actual = determineImageProperties.calculateLargestDimensions(
			{ width: 240, height: 480 },
			{ widthRatio: 1.2, heightRatio: 1.2 } );
		const expected = { height: 400, width: 200 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the width and height for an image for which the heightRatio is greater than the widthRatio", () => {
		const actual = determineImageProperties.calculateLargestDimensions(
			{ width: 240, height: 480 },
			{ widthRatio: 1.2, heightRatio: 1.5 } );
		const expected = { height: 400, width: 200 };

		expect( actual ).toEqual( expected );
	} );
} );

describe( "calculateImageDimensions", () => {
	it( "returns the original dimensions when the original Twitter image is too small", () => {
		const actual = determineImageProperties.calculateImageDimensions(
			{ squareWidth: 123, squareHeight: 123 },
			{ width: 100, height: 100 },
			"square" );
		const expected = { width: 100, height: 100 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the Facebook image dimensions for an image that was originally square", () => {
		const actual = determineImageProperties.calculateImageDimensions(
			{ squareWidth: 158, squareHeight: 158 },
			{ width: 600, height: 600 },
			"square" );
		const expected = { width: 158, height: 158 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the Twitter image dimensions for an image that originally wasn't square, " +
		"but should in the end be rendered as square", () => {
		/*
		 * It doesn't come out as square yet, this will happen through
		 * the retrieveContainerDimensions function in TwitterImage.js.
		 */
		const actual = determineImageProperties.calculateImageDimensions(
			{ squareWidth: 123, squareHeight: 123 },
			{ width: 184.5, height: 147.6 },
			"square" );
		const expected = { width: 153.75, height: 123 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the Facebook image dimensions for a portrait image", () => {
		const actual = determineImageProperties.calculateImageDimensions(
			{ portraitWidth: 158, portraitHeight: 236 },
			{ width: 316, height: 708 },
			"portrait" );
		const expected = { width: 158, height: 354 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the Twitter image dimensions for a landscape image", () => {
		const actual = determineImageProperties.calculateImageDimensions(
			{ landscapeWidth: 506, landscapeHeight: 253 },
			{ width: 1518, height: 506 },
			"landscape" );
		const expected = { width: 759, height: 253 };

		expect( actual ).toEqual( expected );
	} );
} );
