import React from "react";
import { render } from "@testing-library/react";
import { noop } from "lodash";

import IconButtonToggle from "../src/IconButtonToggle";

test( "the unpressed IconButtonToggle matches the snapshot", () => {
	const { container } = render(
		<IconButtonToggle
			name="group1"
			id="RadioButton"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ false }
			onClick={ noop }
		/>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the pressed IconButtonToggle matches the snapshot", () => {
	const { container } = render(
		<IconButtonToggle
			name="group1"
			id="RadioButton2"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ true }
			onClick={ noop }
		/>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the disabled IconButtonToggle matches the snapshot", () => {
	const { container } = render(
		<IconButtonToggle
			name="group1"
			id="RadioButton2"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ false }
			onClick={ noop }
			marksButtonStatus={ "disabled" }
		/>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the IconButtonToggle logs a deprecation warning", () => {
	const warn = jest.spyOn( console, "warn" ).mockImplementation( noop );

	render(
		<IconButtonToggle
			id="RadioButton"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ false }
			onClick={ jest.fn() }
		/>
	);

	expect( warn ).toHaveBeenCalledWith( expect.stringContaining( "The IconButtonToggle component has been deprecated" ) );
	warn.mockRestore();
} );
