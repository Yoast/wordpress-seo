import React from "react";
import { render } from "@testing-library/react";
import DurationInput from "../../src/inputs/DurationInput";
const noop = () => {};
describe( "DurationInput", () => {
	it( "should render with only required props", () => {
		const { container } = render( <DurationInput
			label="Duration"
			duration={ 3661 }
			id="very-nice-id"
			onChange={ noop }
		/> );

		const result = container.firstChild;

		expect( result ).not.toBeNull();
	} );

	it( "should render based on provided props", () => {
		const { container } = render(
			<DurationInput
				label="This is my label"
				id="very-nice-id"
				duration={ 3661 }
				onChange={ noop }
			/>
		);

		const result = container.firstChild;

		expect( result ).not.toBeNull();
		// A duration of 3661 seconds is 1 hour, 1 minute and 1 second.
		expect( container.querySelector( "#very-nice-id-hours" ).value ).toBe( "1" );
		expect( container.querySelector( "#very-nice-id-minutes" ).value ).toBe( "1" );
		expect( container.querySelector( "#very-nice-id-seconds" ).value ).toBe( "1" );
	} );
} );
