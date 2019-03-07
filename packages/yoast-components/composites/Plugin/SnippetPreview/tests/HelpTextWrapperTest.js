/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";
import EnzymeAdapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme/build/index";

/* Internal dependencies */
import HelpTextWrapper from "../components/HelpTextWrapper";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

describe( "HelpTextWrapper", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<HelpTextWrapper helpTextButtonLabel="Open help" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when the help text button is focused", () => {
		const wrapper = Enzyme.mount(
			<HelpTextWrapper helpTextButtonLabel="Open help" />
		);
		wrapper.find( "button" ).simulate( "click", {
			state: {
				isExpanded: false,
			},
		} );
		expect( wrapper.state().isExpanded ).toEqual( true );
	} );
} );
