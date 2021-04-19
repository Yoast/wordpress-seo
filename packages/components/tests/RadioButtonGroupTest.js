import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";

import RadioButtonGroup from "../src/radiobutton/RadioButtonGroup";

describe( "RadioButtonGroup", () => {
	const renderer = new ReactShallowRenderer();
	it( "should render with only the required props", () => {
		renderer.render(
			<RadioButtonGroup
				label="Nice label"
				groupName="best-group"
				options={ [
					{
						value: "1",
						label: "hi",
						checked: false,
					},
					{
						value: "2",
						label: "ho",
						checked: true,
					},
				] }
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.label ).toBe( "Nice label" );
		expect( result.props.children.props.groupName ).toBe( "best-group" );
	} );
} );
