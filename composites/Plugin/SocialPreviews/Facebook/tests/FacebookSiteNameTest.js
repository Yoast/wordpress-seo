/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";
import EnzymeAdapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme/build/index";

/* Internal dependencies */
import FacebookSiteName from "../components/FacebookSiteName";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

describe( "FacebookSiteName", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<FacebookSiteName siteName="sitename.com" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
