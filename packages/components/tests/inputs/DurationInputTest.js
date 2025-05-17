import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DurationInput from "../../src/inputs/DurationInput";
const noop = () => {};
describe( "DurationInput", () => {
	const renderer = new ReactShallowRenderer();
	it( "should render with only required props", () => {
		renderer.render( <DurationInput
			label="Duration"
			duration={ 3661 }
			id="very-nice-id"
			onChange={ noop }
		/> );

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
	} );

	it( "should render based on provided props", () => {
		renderer.render(
			<DurationInput
				label="This is my label"
				id="very-nice-id"
				duration={ 3661 }
				onChange={ noop }
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.duration ).toBe( 3661 );
		expect( result.props.id ).toBe( "very-nice-id" );
	} );
} );
