import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Checkbox from "../src/checkbox/Checkbox";

describe( "Checkbox", () => {
	it( "matches the snapshot", () => {
		const { container } = render(
			<Checkbox id="test-id" label="test label" />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as a label", () => {
		const { container } = render(
			<Checkbox id="test-id" label={ [ "test label ", "using arrays" ] } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "executes callback once", () => {
		const onChange = jest.fn();
		const { container } = render(
			<Checkbox
				id="testCallback"
				onChange={ onChange }
				label="testCallbackLabel"
			/>
		);

		fireEvent.click( container.querySelector( "input" ) );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
