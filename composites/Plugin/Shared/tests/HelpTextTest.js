/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import HelpText from "../components/HelpText";

describe( "HelpText", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<HelpText>
				{ "Some help text." },
			</HelpText>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as text", () => {
		const component = renderer.create(
			<HelpText>
				{ [ "Text ", "<a href=\"https://www.example.com\">with a link</a>", " in the middle." ] },
			</HelpText>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
