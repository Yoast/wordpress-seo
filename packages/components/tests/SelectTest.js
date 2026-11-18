import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { Select } from "../src/select/Select";

describe( "Select", () => {
	it( "should render a select", () => {
		const mockChange = jest.fn();
		const { container } = render(
			<Select
				label="Nice label"
				options={ [ { name: "hi", value: "hi" }, { name: "ho", value: "ho" } ] }
				id="my-awesome-multiselect"
				name="my-selection"
				selected="ho"
				onChange={ mockChange }
			/>
		);
		const select = screen.getByLabelText( "Nice label" );

		expect( container.firstChild ).toMatchSnapshot();
		expect( select.value ).toBe( "ho" );
		fireEvent.blur( select );
		expect( mockChange ).toHaveBeenCalledTimes( 1 );
		expect( mockChange ).toHaveBeenCalledWith( "ho" );
	} );
} );
