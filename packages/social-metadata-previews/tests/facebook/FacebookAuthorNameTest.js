/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookAuthorName from "../../src/facebook/FacebookAuthorName";

describe( "FacebookAuthorName", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<FacebookAuthorName authorName="John Doe" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
