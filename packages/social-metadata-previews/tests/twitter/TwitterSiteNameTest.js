/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterSiteUrl from "../../src/twitter/TwitterSiteUrl";

describe( "TwitterSiteUrl", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<TwitterSiteUrl siteUrl="sitename.com" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
