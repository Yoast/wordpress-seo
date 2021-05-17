/* External dependencies */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";

/* Internal dependencies */
import ProgressIndicator from "../src/ProgressIndicator";

describe( "a processIndicator component", () => {
	const renderer = new ReactShallowRenderer();

	const inputProps = {
		currentStepNumber: 1,
		totalSteps: 1,
	};

	it( "shows a paragraph with the progress", () => {
		const processIndicator = renderer.render( <ProgressIndicator { ...inputProps } /> );
		const children = processIndicator.props.children;

		expect( processIndicator.type ).toEqual( "p" );

		expect( children[ 0 ] ).toEqual( "Step " );
		expect( children[ 1 ] ).toEqual( inputProps.currentStepNumber );
		expect( children[ 2 ] ).toEqual( " of " );
		expect( children[ 3 ] ).toEqual( inputProps.totalSteps );
	} );

	it( "shows unknown progress with currentStepNumber 0", () => {
		const processIndicator = renderer.render( <ProgressIndicator currentStepNumber={ 0 } totalSteps={ 1 } /> );

		expect( processIndicator.type ).toEqual( "p" );
		expect( processIndicator.props.children ).toEqual( "Unknown step progress" );
	} );

	it( "shows unknown progress with total steps lower than the current step", () => {
		const currentStepNumber = 2;
		const processIndicator = renderer.render( <ProgressIndicator currentStepNumber={ currentStepNumber } totalSteps={ 1 } /> );

		const children = processIndicator.props.children;

		expect( children[ 0 ] ).toEqual( "Step " );
		expect( children[ 1 ] ).toEqual( currentStepNumber );
	} );

	it( "throws error with one or more missing parameters", () => {
		console.error = jest.fn();
		renderer.render( <ProgressIndicator /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();

		const errors = console.error.mock.calls;
		expect( errors[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
		expect( errors[ 1 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );

	it( "throws error with invalid prop types", () => {
		console.error = jest.fn();
		renderer.render( <ProgressIndicator currentStepNumber={ "test" } totalSteps={ [] } /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();

		const errors = console.error.mock.calls;
		expect( errors[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
		expect( errors[ 1 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );
} );
