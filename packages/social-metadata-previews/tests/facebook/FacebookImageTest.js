/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookImage from "../../src/facebook/FacebookImage";
import { retrieveContainerDimensions } from "../../src/facebook/FacebookImage";

import * as determineImageProperties from "../../src/helpers/determineImageProperties";
determineImageProperties.determineImageProperties = jest.fn();

describe( "retrieveContainerDimensions", () => {
	it( "retrieves the container dimensions for a landscape image", () => {
		const actual = retrieveContainerDimensions( "landscape" );
		const expected = { height: 261 + "px", width: 500 + "px" };

		expect( actual ).toEqual( expected );
	} );

	it( "retrieves the container dimensions for a square image", () => {
		const actual = retrieveContainerDimensions( "square" );
		const expected = { height: 158 + "px", width: 158 + "px" };

		expect( actual ).toEqual( expected );
	} );

	it( "retrieves the container dimensions for a portrait image", () => {
		const actual = retrieveContainerDimensions( "portrait" );
		const expected = { height: 236 + "px", width: 158 + "px" };

		expect( actual ).toEqual( expected );
	} );
} );

describe( "FacebookImage", () => {
	it( "matches the snapshot for a landscape image", () => {
		const component = renderer.create(
			<FacebookImage
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
			<FacebookImage
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
			<FacebookImage
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
			<FacebookImage
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
			<FacebookImage
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
