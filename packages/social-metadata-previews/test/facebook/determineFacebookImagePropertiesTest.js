import {
	determineFacebookImageMode,
	getImageRatios,
	getImageDimensionsForFacebookImage,
	calculateFacebookImageDimensions,
} from "../../src/facebook/helpers/determineFacebookImageProperties";

describe( "determineFacebookImageMode", () => {
	it( "returns square when the width and height are the same.", () => {
		const actual = determineFacebookImageMode( { width: 300, height: 300 } );
		const expected = "square";

		expect( actual ).toEqual( expected );
	} );

	it( "returns portrait when the height is greater than the width.", () => {
		const actual = determineFacebookImageMode( { width: 300, height: 600 } );
		const expected = "portrait";

		expect( actual ).toEqual( expected );
	} );

	it( "returns portrait when the width is greater than the height.", () => {
		const actual = determineFacebookImageMode( { width: 600, height: 300 } );
		const expected = "landscape";

		expect( actual ).toEqual( expected );
	} );
} );

describe( "getImageRatios", () => {
	it( "returns the widthRatio and heightRatio for an image in portrait mode.", () => {
		const actual = getImageRatios( { width: 316, height: 472 }, "portrait" );
		const expected = { heightRatio: 2, widthRatio: 2 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the widthRatio and heightRatio for an image in landscape mode.", () => {
		const actual = getImageRatios( { width: 600, height: 522 }, "landscape" );
		const expected = { heightRatio: 2, widthRatio: 1.2 };

		expect( actual ).toEqual( expected );
	} );
} );

describe( "getImageDimensionsForFacebookImage", () => {
	it( "returns the width and height for an image for which the widthRatio is greater than the heightRatio.", () => {
		const actual = getImageDimensionsForFacebookImage( { width: 316, height: 590 }, { heightRatio: 2, widthRatio: 2.5 } );
		const expected = { height: 295, width: 158 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the width and height for an image for which the widthRatio and heightRatio are the same.", () => {
		const actual = getImageDimensionsForFacebookImage( { width: 316, height: 472 }, { heightRatio: 2, widthRatio: 2 } );
		const expected = { height: 236, width: 158 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the width and height for an image for which the heightRatio is greater than the widthRatio.", () => {
		const actual = getImageDimensionsForFacebookImage( { width: 600, height: 522 }, { heightRatio: 2, widthRatio: 1.2 } );
		const expected = { height: 435, width: 500 };

		expect( actual ).toEqual( expected );
	} );
} );

describe( "calculateFacebookImageDimensions", () => {
	it( "returns the facebook image dimensions for a portrait image.", () => {
		const actual = calculateFacebookImageDimensions( { width: 316, height: 590 }, "portrait" );
		const expected = { height: 295, width: 158 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the facebook image dimensions for a landscape image.", () => {
		const actual = calculateFacebookImageDimensions( { width: 750, height: 450 }, "landscape" );
		const expected = { height: 300, width: 500 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the facebook image dimensions for a square image.", () => {
		const actual = calculateFacebookImageDimensions( { width: 600, height: 600 }, "square" );
		const expected = { height: 158, width: 158 };

		expect( actual ).toEqual( expected );
	} );

	it( "returns the original dimensions when the original image has a width or heigth smaller than 158px.", () => {
		const actual = calculateFacebookImageDimensions( { width: 100, height: 100 }, "square" );
		const expected = { height: 100, width: 100 };

		expect( actual ).toEqual( expected );
	} );
} );

