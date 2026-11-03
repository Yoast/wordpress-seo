import React from "react";
import { render, screen } from "@testing-library/react";

import RadioButtonGroup from "../src/radiobutton/RadioButtonGroup";

describe( "RadioButtonGroup", () => {
	it( "should render with only the required props", () => {
		const { container } = render(
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

		const result = container.firstChild;

		expect( result ).not.toBeNull();
		expect( screen.getByText( "Nice label" ) ).not.toBeNull();
		screen.getAllByRole( "radio" ).forEach( radio => expect( radio.name ).toBe( "best-group" ) );
	} );
} );
