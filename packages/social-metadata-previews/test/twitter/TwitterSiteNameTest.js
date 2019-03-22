/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterSiteName from "../../src/twitter/TwitterSiteName";

describe( "TwitterSiteName", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<TwitterSiteName siteName="sitename.com" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
