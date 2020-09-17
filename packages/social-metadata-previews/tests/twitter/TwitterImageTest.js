/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterImage from "../../src/twitter/TwitterImage";
import delayComponentSnapshot from "../testHelpers/delayComponentSnapshot";

import * as determineImageProperties from "../../src/helpers/determineImageProperties";
determineImageProperties.handleImage = jest.fn();

describe( "TwitterImage Component", () => {
	it( "calls determineImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg";

		determineImageProperties.handleImage.mockReturnValueOnce(
			{
				imageProperties: {
					mode: "landscape",
					height: 300,
					width: 600,
				},
				status: "loaded",
			}
		);

		renderer.create(
			<TwitterImage src={ imageUrl } isLarge={ true } />
		);

		expect( determineImageProperties.handleImage ).toBeCalledWith( imageUrl, "Twitter", true );
	} );

	it( "matches the snapshot in the loading state", () => {
		determineImageProperties.handleImage.mockReturnValueOnce(
			// Make sure the promise is never resolved to keep the loading state.
			new Promise( () => {} )
		);
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" isLarge={ true } />
		);
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot for a landscape image in a summary card", () => {
		determineImageProperties.handleImage.mockReturnValueOnce(
			{
				imageProperties: {
					mode: "landscape",
					height: 300,
					width: 600,
				},
				status: "loaded",
			}
		);
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg" isLarge={ false } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a landscape image in a summary-large-image card", () => {
		determineImageProperties.handleImage.mockReturnValueOnce( {
			imageProperties: {
				mode: "landscape",
				height: 300,
				width: 600,
			},
			status: "loaded",
		} );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg" isLarge={ true } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image in a summary card", () => {
		determineImageProperties.handleImage.mockReturnValueOnce( {
			imageProperties: {
				mode: "square",
				height: 300,
				width: 300,
			},
			status: "loaded",
		} );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png" isLarge={ false } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image in a summary-large-image card", () => {
		determineImageProperties.handleImage.mockReturnValueOnce(
			{
				imageProperties: {
					mode: "square",
					height: 300,
					width: 300,
				},
				status: "loaded",
			}
		);
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png" isLarge={ true } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );
} );
