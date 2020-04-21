/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterPreview from "../../src/twitter/TwitterPreview";

describe( "TwitterPreview", () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<TwitterPreview
				image="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				type="summary-large-image"
				title="YoastCon Workshops &bull; Yoast"
				siteUrl="yoast.com"
				isLarge={ false }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
