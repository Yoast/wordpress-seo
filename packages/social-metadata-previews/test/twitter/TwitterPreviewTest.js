/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterPreview from "../../src/twitter/TwitterPreview";

describe( "TwitterPreview", () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
