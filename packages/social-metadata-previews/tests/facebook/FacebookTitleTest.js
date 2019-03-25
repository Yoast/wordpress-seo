/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookTitle from "../../src/facebook/FacebookTitle";

describe( "FacebookTitle", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<FacebookTitle title="YoastCon Workshops" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
