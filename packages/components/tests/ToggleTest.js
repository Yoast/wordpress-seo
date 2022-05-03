import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";

import Toggle from "../src/toggle/Toggle";

describe( "Toggle", () => {
	const renderer = new ReactShallowRenderer();
	it( "should render with only the required props", () => {
		renderer.render(
			<Toggle
				label="React Toggle"
				offText="off"
				onText="on"
				name="toggle"
				id="weird-id-that-is-unique"
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.children.props.className ).toBe( "yoast-toggle" );
	} );
	it( "should fire the onChange event when the input is changed", () => {
		const mockChange = jest.fn();
		renderer.render(
			<Toggle
				label="React Toggle"
				offText="off"
				onText="on"
				name="toggle"
				id="weird-id-that-is-unique"
				onChange={ mockChange }
			/>
		);

		const result = renderer.getRenderOutput();
		const mockEvent = { target: { checked: true } };
		const toggle = result.props.children.props;
		const hiddenInput = toggle.children[ 0 ];

		// Fire the onChange event on the input. This will trigger the onChangeHandler() which should call the onChange function passed as prop.
		hiddenInput.props.onChange( mockEvent );
		expect( mockChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
