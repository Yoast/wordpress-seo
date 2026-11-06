/* External dependencies */
import React, { act } from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import HelpText from "../src/HelpText";

describe( "HelpText", () => {
	it( "matches the snapshot by default", () => {
		let component;
		act( () => {
			component = renderer.create(
				<HelpText>
					{ "Some help text." }
				</HelpText>
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as text", () => {
		let component;
		act( () => {
			component = renderer.create(
				<HelpText>
					{ [ "Text ", <a key="1" href="https://www.example.org">with a link</a>, " in the middle." ] }
				</HelpText>
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
