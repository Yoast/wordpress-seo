import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import Toggle from "../src/toggle/Toggle";

describe( "Toggle", () => {
	it( "should render with only the required props", () => {
		const { container } = render(
			<Toggle
				label="React Toggle"
				offText="off"
				onText="on"
				name="toggle"
				id="weird-id-that-is-unique"
			/>
		);

		const result = container.firstChild;

		expect( result ).not.toBeNull();
		expect( result.querySelector( ".yoast-toggle" ) ).not.toBeNull();
	} );
	it( "should fire the onChange event when the input is changed", () => {
		const mockChange = jest.fn();
		render(
			<Toggle
				label="React Toggle"
				offText="off"
				onText="on"
				name="toggle"
				id="weird-id-that-is-unique"
				onChange={ mockChange }
			/>
		);

		const hiddenInput = screen.getByRole( "checkbox" );

		// Click the checkbox to fire its onChange event.
		// This will trigger the onChangeHandler() which should call the onChange function passed as prop.
		fireEvent.click( hiddenInput );
		expect( mockChange ).toHaveBeenCalledTimes( 1 );
		expect( mockChange ).toHaveBeenCalledWith( "on" );
	} );
} );
