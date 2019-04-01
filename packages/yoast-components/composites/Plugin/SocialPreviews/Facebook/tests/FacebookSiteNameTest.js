/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookSiteName from "../components/FacebookSiteName";

describe( "FacebookSiteName", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<FacebookSiteName siteName="sitename.com" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
