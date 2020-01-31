/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterTitle from "../../src/twitter/TwitterTitle";

describe( "TwitterTitle", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<TwitterTitle title="My Twitter Title" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
