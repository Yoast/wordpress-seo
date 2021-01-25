import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DurationInput from "../../src/inputs/DurationInput";

describe( "DurationInput", () => {
	const renderer = new ReactShallowRenderer();
	it( "should render with only required props", () => {
		renderer.render( <DurationInput
			label="Duration"
			hours={ 1 }
			minutes={ 2 }
			seconds={ 3 }
			onChange={ () => console.log( "test" ) }
		/> );

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
	} );

	it( "should render based on provided props", () => {
		renderer.render(
			<DurationInput
				label="This is my label"
				id="very-nice-id"
				hours={ 1 }
				minutes={ 2 }
				seconds={ 3 }
				onChange={ () => console.log( "test" ) }
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.htmlFor ).toBe( "very-nice-id" );
		expect( result.props.hours ).toBe( 1 );
		expect( result.props.minutes ).toBe( 2 );
		expect( result.props.seconds ).toBe( 3 );
		expect( result.props.id ).toBe( "very-nice-id" );
	} );
} );
