/* Internal dependencies */
import * as determineImageProperties from "../../src/helpers/determineImageProperties";
import { createSuccessfulImage } from "../testHelpers/mockImage";

describe( "determineFacebookImageMode", () => {
	it( "Facebook preview returns square when the width and height are the same", () => {
		const actual = determineImageProperties.determineFacebookImageMode(
			{ width: 300, height: 300 } );
		const expected = "square";

		expect( actual ).toEqual( expected );
	} );

	it( "Facebook preview returns portrait when the height is greater than the width", () => {
		const actual = determineImageProperties.determineFacebookImageMode(
			{ width: 300, height: 600 } );
		const expected = "portrait";

		expect( actual ).toEqual( expected );
	} );

	it( "Facebook preview returns landscape when the width is greater than the height", () => {
		const actual = determineImageProperties.determineFacebookImageMode(
			{ width: 600, height: 300 } );
		const expected = "landscape";

		expect( actual ).toEqual( expected );
	} );
} );

describe( "retrieveExpectedDimensions", () => {
	it( "returns Twitter image sizes when SocialMedium is set to 'Twitter'", () => {
		const actual = determineImageProperties.retrieveExpectedDimensions( "Twitter" );
		const expected = {
			squareWidth: 125,
			squareHeight: 125,
			landscapeWidth: 506,
			landscapeHeight: 265,
			aspectRatio: 50.2,
		};

		expect( actual ).toEqual( expected );
	} );

	it( "returns Facebook image sizes when SocialMedium is set to 'Facebook'", () => {
		const actual = determineImageProperties.retrieveExpectedDimensions( "Facebook" );
		const expected = {
			squareWidth: 158,
			squareHeight: 158,
			landscapeWidth: 527,
			landscapeHeight: 273,
			portraitWidth: 158,
			portraitHeight: 237,
			aspectRatio: 52.2,
			largeThreshold: { width: 446, height: 233 },
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
		const expected = { widthRatio: 2, heightRatio: 1.9915611814345993 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the widthRatio and heightRatio for a Facebook image in landscape mode", () => {
		const actual = determineImageProperties.calculateImageRatios(
			determineImageProperties.FACEBOOK_IMAGE_SIZES,
			{ width: 600, height: 522 },
			"landscape" );
		const expected = { widthRatio: 1.1385199240986716, heightRatio: 1.9120879120879122 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the widthRatio and heightRatio for a Twitter image in square mode", () => {
		const actual = determineImageProperties.calculateImageRatios(
			determineImageProperties.TWITTER_IMAGE_SIZES,
			{ width: 250, height: 250 },
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
			{ squareWidth: 125, squareHeight: 125 },
			{ width: 184.5, height: 147.6 },
			"square" );
		const expected = { width: 156, height: 125 };

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
			{ landscapeWidth: 506, landscapeHeight: 254 },
			{ width: 1518, height: 506 },
			"landscape" );
		const expected = { width: 762, height: 254 };

		expect( actual ).toEqual( expected );
	} );
} );

describe( "determineImageProperties", () => {
	let OriginalImage;

	beforeAll( () => {
		OriginalImage = Image;
	} );

	afterAll( () => {
		global.Image = OriginalImage;
	} );

	it( "returns the image properties for a large landscape image in Twitter", async() => {
		global.Image = createSuccessfulImage( 1200, 628 );

		/*
		The src (below) is not actually used for calculating original dimensions.
		This is because img.onload is only executed in the browser, but not in Jest.
		Therefore, we use the MockedImage class to mock an image.
		 */
		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg",
			"Twitter",
			true
		);

		const expected = { mode: "landscape", width: 506, height: 265 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a small landscape image in Twitter", async() => {
		global.Image = createSuccessfulImage( 250, 131 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2008/04/WordPress_SEO_definitive_guide_FI-250x131.png",
			"Twitter",
			false
		);

		const expected = { mode: "square", width: 239, height: 125 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a large portrait image in Twitter", async() => {
		global.Image = createSuccessfulImage( 403, 605 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://i1.wp.com/2016.europe.wordcamp.org/files/2016/04/Joost-Marieke.jpg?w=403&h=605&ssl=1",
			"Twitter",
			true
		);

		const expected = { mode: "landscape", width: 506, height: 760 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a small portrait image in Twitter", async() => {
		global.Image = createSuccessfulImage( 240, 268 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png",
			"Twitter",
			false
		);

		const expected = { mode: "square", width: 125, height: 140 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a large square image in Twitter", async() => {
		global.Image = createSuccessfulImage( 512, 512 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/sites/5/2016/09/yoast-logo-icon-512x512.png",
			"Twitter",
			true
		);

		const expected = { mode: "landscape", width: 506, height: 506 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a small square image in Twitter", async() => {
		global.Image = createSuccessfulImage( 250, 250 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png",
			"Twitter",
			false
		);

		const expected = { mode: "square", width: 125, height: 125 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a too small image in Twitter", async() => {
		global.Image = createSuccessfulImage( 205, 105 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png",
			"Twitter",
			false
		);

		const expected = { mode: "square", width: 244, height: 125 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a landscape image in Facebook", async() => {
		global.Image = createSuccessfulImage( 1200, 628 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png",
			"Facebook"
		);

		const expected = { mode: "landscape", width: 527, height: 276 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a portrait image in Facebook", async() => {
		global.Image = createSuccessfulImage( 240, 268 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png",
			"Facebook"
		);

		const expected = { mode: "portrait", width: 212, height: 237 };
		expect( imageProperties ).toEqual( expected );
	} );

	it( "returns the image properties for a square image in Facebook", async() => {
		global.Image = createSuccessfulImage( 500, 500 );

		const imageProperties = await determineImageProperties.determineImageProperties(
			"https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png",
			"Facebook"
		);

		const expected = { mode: "square", width: 158, height: 158 };
		expect( imageProperties ).toEqual( expected );
	} );
} );
