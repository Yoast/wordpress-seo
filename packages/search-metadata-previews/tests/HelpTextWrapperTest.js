/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import HelpTextWrapper from "../src/snippet-preview/HelpTextWrapper";


describe( "HelpTextWrapper", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<HelpTextWrapper helpTextButtonLabel="Open help" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when the help text button is focused", () => {

	} );
} );
