/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookImage from "../../src/facebook/FacebookImage";
import delayComponentSnapshot from "../testHelpers/delayComponentSnapshot";

import * as determineImageProperties from "../../src/helpers/determineImageProperties";
determineImageProperties.determineImageProperties = jest.fn();

describe( "FacebookImage Component", () => {
	it( "calls determineImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png";

		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );

		renderer.create(
			<FacebookImage src={ imageUrl } />
		);

		expect( determineImageProperties.determineImageProperties ).toBeCalledWith( imageUrl, "Facebook" );
	} );

	it( "matches the snapshot in the loading state", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce(
			// Make sure the promise is never resolved to keep the loading state.
			new Promise( () => {} )
		);
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" />
		);
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot for a portrait image", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a landscape image", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "landscape",
			height: 300,
			width: 600,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png" />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "square",
			height: 300,
			width: 300,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png" />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a too small image", () => {
		determineImageProperties.determineImageProperties.mockReturnValue( Promise.resolve( {
			mode: "square",
			height: 100,
			width: 100,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png" />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a faulty image", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.reject() );

		const component = renderer.create(
			<FacebookImage src="thisisnoimage" />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );
} );

describe( "retrieveContainerDimensions", () => {
	it( "retrieves the container dimensions for a landscape image", () => {
		const FacebookImageComponent = new FacebookImage();

		const actual = FacebookImageComponent.retrieveContainerDimensions( "landscape" );
		const expected = { height: 261 + "px", width: 500 + "px" };

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
		const expected = { height: 236 + "px", width: 158 + "px" };

		expect( actual ).toEqual( expected );
	} );
} );
