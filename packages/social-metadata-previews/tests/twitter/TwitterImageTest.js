/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterImage from "../../src/twitter/TwitterImage";
import delayComponentSnapshot from "./testHelpers/delayComponentSnapshot";
import { LANDSCAPE_HEIGHT,
	LANDSCAPE_WIDTH,
	SQUARE_HEIGHT,
	SQUARE_WIDTH,
} from "../../src/helpers/determineTwitterImageProperties";
const importedDetermineTwitterImageProperties = require( "../../src/helpers/determineTwitterImageProperties.js" );

jest.mock( "../../src/helpers/determineTwitterImageProperties.js", () => {
	return {
		determineTwitterImageProperties: jest.fn(),
		SQUARE_WIDTH: 123,
		SQUARE_HEIGHT: 123,
		LANDSCAPE_WIDTH: 506,
		LANDSCAPE_HEIGHT: 253,
	};
} );

describe( "TwitterImage Component", () => {
	it( "calls determineTwitterImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png";

		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );

		renderer.create(
			<TwitterImage src={ imageUrl } type="summary" />
		);

		expect( importedDetermineTwitterImageProperties.determineTwitterImageProperties ).toBeCalledWith( imageUrl, "summary" );
	} );

	it( "matches the snapshot in the loading state", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce(
			// Make sure the promise is never resolved to keep the loading state.
			new Promise( () => {} )
		);
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" type="summary" />
		);
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot for a portrait image in a summary card", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" type="summary" />
		);

		// Wait for the determineTwitterImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a portrait image in a summary-large-image card", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" type="summary-large-image" />
		);

		// Wait for the determineTwitterImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a landscape image in a summary card", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "landscape",
			height: 300,
			width: 600,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg" type="summary" />
		);

		// Wait for the determineTwitterImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a landscape image in a summary-large-image card", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "landscape",
			height: 300,
			width: 600,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg" type="summary-large-image" />
		);

		// Wait for the determineTwitterImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image in a summary card", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "square",
			height: 300,
			width: 300,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png" type="summary" />
		);

		// Wait for the determineTwitterImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image in a summary-large-image card", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "square",
			height: 300,
			width: 300,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png" type="summary-large-image" />
		);

		// Wait for the determineTwitterImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a too small image", () => {
		importedDetermineTwitterImageProperties.determineTwitterImageProperties.mockReturnValue( Promise.resolve( {
			mode: "square",
			height: 100,
			width: 100,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png" type="summary" />
		);

		// Wait for the determineTwitterImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );
} );

describe( "getContainerDimensions", () => {
	it( "gets the container dimensions for a landscape image.", () => {
		const TwitterImageComponent = new TwitterImage();

		const actual = TwitterImageComponent.getContainerDimensions( "landscape" );
		const expected = { height: LANDSCAPE_HEIGHT + "px", width: LANDSCAPE_WIDTH + "px" };

		expect( actual ).toEqual( expected );
	} );

	it( "gets the container dimensions for a square image.", () => {
		const TwitterImageComponent = new TwitterImage();

		const actual = TwitterImageComponent.getContainerDimensions( "square" );
		const expected = { height: SQUARE_HEIGHT + "px", width: SQUARE_WIDTH + "px" };

		expect( actual ).toEqual( expected );
	} );

	it( "gets the container dimensions for a portrait image.", () => {
		const TwitterImageComponent = new TwitterImage();

		const actual = TwitterImageComponent.getContainerDimensions( "portrait" );
		const expected = { height: LANDSCAPE_HEIGHT + "px", width: LANDSCAPE_WIDTH + "px" };

		expect( actual ).toEqual( expected );
	} );
} );
