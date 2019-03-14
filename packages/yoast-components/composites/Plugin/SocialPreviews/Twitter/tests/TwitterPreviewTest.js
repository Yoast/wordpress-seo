/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterPreview from "../components/TwitterPreview";

describe( "TwitterPreview", () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<TwitterPreview title="YoastCon Workshops &bull; Yoast" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
