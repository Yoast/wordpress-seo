/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import HelpText from "../components/HelpText";

describe( "HelpText", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<HelpText text="Some help text." />
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as text", () => {
		const component = renderer.create(
			<HelpText text={ [ "Text ", "<a href=\"https://www.example.com\">with a link</a>", " in the middle." ] } />
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
