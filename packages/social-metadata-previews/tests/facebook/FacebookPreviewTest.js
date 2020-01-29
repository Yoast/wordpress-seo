/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import delayComponentSnapshot from "../testHelpers/delayComponentSnapshot";
import FacebookPreview from "../../src/facebook/FacebookPreview";

import * as determineImageProperties from "../../src/helpers/determineImageProperties";
determineImageProperties.determineImageProperties = jest.fn();

describe( "FacebookPreview Component", () => {
	it( "calls determineImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png";

		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "portrait",
			height: 600,
			width: 300,
		} ) );

		renderer.create(
			<FacebookPreview image={ imageUrl } siteName={ "yoast.com" } title={ "yoast test" } />
		);

		expect( determineImageProperties.determineImageProperties ).toBeCalledWith( imageUrl, "Facebook" );
	} );

	it( "matches the snapshot in the loading state", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce(
			// Make sure the promise is never resolved to keep the loading state.
			new Promise( () => {} )
		);
		const component = renderer.create(
			<FacebookPreview image="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" siteName={ "yoast.com" } title={ "yoast test" }  />
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
			<FacebookPreview image="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" siteName={ "yoast.com" } title={ "yoast test" }  />
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
			<FacebookPreview
				image="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png"
				siteName={ "yoast.com" }
				title={ "yoast test" }
			/>
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
			<FacebookPreview
				image="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png"
				siteName={ "yoast.com" }
				title={ "yoast test" }
			/>
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
			<FacebookPreview image="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png" siteName={ "yoast.com" } title={ "yoast test" } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a faulty image", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.reject() );

		const component = renderer.create(
			<FacebookPreview image="thisisnoimage" siteName={ "yoast.com" } title={ "yoast test" }  />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );
} );

describe( "FacebookPreview", () => {
	it( "matches the snapshot for a landscape image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteName="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a landscape image."
				src="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a portrait image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteName="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a portrait image."
				src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a square image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteName="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a square image."
				src="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a too small image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteName="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with too small an image."
				src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a faulty image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteName="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a faulty image."
				src="thisisnoimage"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
