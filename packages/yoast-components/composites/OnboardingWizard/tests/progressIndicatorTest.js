jest.unmock( "../ProgressIndicator" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import ProgressIndicator from "../ProgressIndicator";

describe( "a processIndicator component", () => {
	const renderer = new ReactShallowRenderer();

	const inputProps = {
		currentStepNumber: 1,
		totalSteps: 1,
	};

	it( "shows a paragraph with the progress", () => {
		const processIndicator = new ProgressIndicator( inputProps );
		const children = processIndicator.props.children;

		expect( processIndicator.type ).toEqual( "p" );

		expect( children[ 0 ] ).toEqual( "Step " );
		expect( children[ 1 ] ).toEqual( inputProps.currentStepNumber );
		expect( children[ 2 ] ).toEqual( " of " );
		expect( children[ 3 ] ).toEqual( inputProps.totalSteps );
	} );

	it( "shows unknown progress with currentStepNumber 0", () => {
		const processIndicator = new ProgressIndicator(
			{
				currentStepNumber: 0,
				totalSteps: 1,
			}
		);

		expect( processIndicator.type ).toEqual( "p" );
		expect( processIndicator.props.children ).toEqual( "Unknown step progress" );
	} );

	it( "shows unknown progress with total steps lower than the current step", () => {
		const currentStepNumber = 2;

		const processIndicator = new ProgressIndicator(
			{
				currentStepNumber,
				totalSteps: 1,
			}
		);

		const children = processIndicator.props.children;

		expect( children[ 0 ] ).toEqual( "Step " );
		expect( children[ 1 ] ).toEqual( currentStepNumber );
	} );

	it( "throws error with one or more missing parameters", () => {
		console.error = jest.genMockFn();
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
		console.error = jest.genMockFn();
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
