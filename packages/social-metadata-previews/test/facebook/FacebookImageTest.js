/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookImage from "../../src/facebook/FacebookImage";
import delayComponentSnapshot from "./testHelpers/delayComponentSnapshot";

const importedDetermineFacebookImageProperties = require( "../../src/helpers/determineFacebookImageProperties.js" );

jest.mock( "../helpers/determineFacebookImageProperties.js", () => {
	return {
		determineFacebookImageProperties: jest.fn(),
		SQUARE_WIDTH: 158,
		SQUARE_HEIGHT: 158,
		PORTRAIT_WIDTH: 158,
		PORTRAIT_HEIGHT: 236,
		LANDSCAPE_WIDTH: 500,
		LANDSCAPE_HEIGHT: 261,
	};
} );

describe( "FacebookImage Component", () => {
	it( "calls determineFacebookImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png";

		importedDetermineFacebookImageProperties.determineFacebookImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );

		renderer.create(
			<FacebookImage src={ imageUrl } />
		);

		expect( importedDetermineFacebookImageProperties.determineFacebookImageProperties ).toBeCalledWith( imageUrl );
	} );

	it( "matches the snapshot in the loading state", () => {
		importedDetermineFacebookImageProperties.determineFacebookImageProperties.mockReturnValueOnce(
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
		importedDetermineFacebookImageProperties.determineFacebookImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" />
		);

		// Wait for the determineFacebookImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a landscape image", () => {
		importedDetermineFacebookImageProperties.determineFacebookImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "landscape",
			height: 300,
			width: 600,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png" />
		);

		// Wait for the determineFacebookImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image", () => {
		importedDetermineFacebookImageProperties.determineFacebookImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "square",
			height: 300,
			width: 300,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png" />
		);

		// Wait for the determineFacebookImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a too small image", () => {
		importedDetermineFacebookImageProperties.determineFacebookImageProperties.mockReturnValue( Promise.resolve( {
			mode: "square",
			height: 100,
			width: 100,
		} ) );
		const component = renderer.create(
			<FacebookImage src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png" />
		);

		// Wait for the determineFacebookImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a faulty image", () => {
		importedDetermineFacebookImageProperties.determineFacebookImageProperties.mockReturnValueOnce( Promise.reject() );

		const component = renderer.create(
			<FacebookImage src="thisisnoimage" />
		);

		// Wait for the determineFacebookImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );
} );

describe( "getContainerDimensions", () => {
	it( "gets the container dimensions for a landscape image.", () => {
		const FacebookImageComponent = new FacebookImage();

		const actual = FacebookImageComponent.getContainerDimensions( "landscape" );
		const expected = { height: "261px", width: "500px" };

		expect( actual ).toEqual( expected );
	} );

	it( "gets the container dimensions for a square image.", () => {
		const FacebookImageComponent = new FacebookImage();

		const actual = FacebookImageComponent.getContainerDimensions( "square" );
		const expected = { height: "158px", width: "158px" };

		expect( actual ).toEqual( expected );
	} );

	it( "gets the container dimensions for a portrait image.", () => {
		const FacebookImageComponent = new FacebookImage();

		const actual = FacebookImageComponent.getContainerDimensions( "portrait" );
		const expected = { height: "236px", width: "158px" };

		expect( actual ).toEqual( expected );
	} );
} );
