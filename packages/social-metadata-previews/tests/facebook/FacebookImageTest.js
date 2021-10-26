/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookImage from "../../src/facebook/FacebookImage";

import * as determineImageProperties from "../../src/helpers/determineImageProperties";
determineImageProperties.handleImage = jest.fn();

describe( "FacebookImage Component", () => {
	it( "calls determineImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png";

		determineImageProperties.handleImage.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );

		renderer.create(
			<FacebookImage src={ imageUrl } />
		);

		expect( determineImageProperties.handleImage ).toBeCalledWith( imageUrl, "Facebook" );
	} );
} );

describe( "retrieveContainerDimensions", () => {
	it( "retrieves the container dimensions for a landscape image", () => {
		const FacebookImageComponent = new FacebookImage();

		const actual = FacebookImageComponent.retrieveContainerDimensions( "landscape" );
		const expected = { height: 273 + "px", width: 527 + "px" };

		expect( actual ).toEqual( expected );
	} );

	it( "retrieves the container dimensions for a square image", () => {
		const FacebookImageComponent = new FacebookImage();

		const actual = FacebookImageComponent.retrieveContainerDimensions( "square" );
		const expected = { height: 158 + "px", width: 158 + "px" };

		expect( actual ).toEqual( expected );
	} );

	it( "retrieves the container dimensions for a portrait image", () => {
		const FacebookImageComponent = new FacebookImage();

		const actual = FacebookImageComponent.retrieveContainerDimensions( "portrait" );
		const expected = { height: 237 + "px", width: 158 + "px" };

		expect( actual ).toEqual( expected );
	} );
} );
