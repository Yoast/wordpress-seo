import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Table from "../src/elements/table";

// Table.CheckboxHeader renders a <th>, which must live inside a valid table structure.
const renderInTable = ( ui ) => render(
	<table><thead><tr>{ ui }</tr></thead></table>
);

describe( "Table.CheckboxHeader", () => {
	it( "calls onChange when clicked", () => {
		const onChange = jest.fn();
		renderInTable(
			<Table.CheckboxHeader
				id="select-all"
				name="select-all"
				checked={ false }
				onChange={ onChange }
				aria-label="Select all"
			/>
		);

		fireEvent.click( screen.getByRole( "checkbox", { name: "Select all" } ) );
		expect( onChange ).toHaveBeenCalled();
	} );

	it( "sets the indeterminate DOM property when some rows are selected", () => {
		renderInTable(
			<Table.CheckboxHeader
				id="select-all"
				name="select-all"
				checked={ false }
				indeterminate={ true }
				onChange={ jest.fn() }
				aria-label="Select all"
			/>
		);

		const checkbox = screen.getByRole( "checkbox", { name: "Select all" } );
		expect( checkbox.indeterminate ).toBe( true );
		expect( checkbox ).not.toBeChecked();
	} );

	it( "is checked and not indeterminate when all rows are selected", () => {
		renderInTable(
			<Table.CheckboxHeader
				id="select-all"
				name="select-all"
				checked={ true }
				indeterminate={ false }
				onChange={ jest.fn() }
				aria-label="Select all"
			/>
		);

		const checkbox = screen.getByRole( "checkbox", { name: "Select all" } );
		expect( checkbox.indeterminate ).toBe( false );
		expect( checkbox ).toBeChecked();
	} );
} );
