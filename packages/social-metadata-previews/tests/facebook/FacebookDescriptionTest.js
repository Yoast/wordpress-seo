/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookDescription from "../../src/facebook/FacebookDescription";

describe( "FacebookDescription", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<FacebookDescription description="Cornerstone content is one of the most important building blocks of your site." />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
