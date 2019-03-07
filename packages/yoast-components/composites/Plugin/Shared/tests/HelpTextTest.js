/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import HelpText from "../components/HelpText";

describe( "HelpText", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<HelpText>
				{ "Some help text." }
			</HelpText>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as text", () => {
		const component = renderer.create(
			<HelpText>
				{ [ "Text ", <a key="1" href="https://www.example.org">with a link</a>, " in the middle." ] }
			</HelpText>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
