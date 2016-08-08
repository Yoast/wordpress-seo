jest.unmock( '../js/progressIndicator' );

import React from 'react';
import ProgressIndicator from '../js/progressIndicator';
import TestUtils from 'react-addons-test-utils';

describe( 'processIndicator constant', () => {
	let renderer = TestUtils.createRenderer();

	let inputProps = {
		currentStepNumber: 1,
		totalSteps: 1
	};

	it( 'has a div container', () => {
		let processIndicator = new ProgressIndicator( {
			currentStepNumber: '',
			totalSteps: ''
		} );

		expect( processIndicator.type ).toEqual( 'div' );
	} );

	it( 'shows a paragraph with the progress', () => {
		let processIndicator = new ProgressIndicator( inputProps );

		let text = processIndicator.props.children;
		let content = text.props.children;

		expect( processIndicator.props.children.type ).toEqual( 'p' );

		expect( content[ 0 ] ).toEqual( 'Step ' );
		expect( content[ 1 ] ).toEqual( inputProps.currentStepNumber );
		expect( content[ 2 ] ).toEqual( ' of ' );
		expect( content[ 3 ] ).toEqual( inputProps.totalSteps );
	} );

	it( 'shows unkown progress with currentStepNumber 0', () => {
		let processIndicator = new ProgressIndicator(
			{
				currentStepNumber: 0,
				totalSteps: 1
			}
		);

		expect( processIndicator.type ).toEqual( 'div' );
		expect( processIndicator.props.children.type ).toEqual( 'p' );
		expect( processIndicator.props.children.props.children ).toEqual( 'Unknown step progress' );
	} );

	it( 'shows unkown progress with total steps lower than the current step', () => {
		let processIndicator = new ProgressIndicator(
			{
				currentStepNumber: 2,
				totalSteps: 1
			}
		);

		expect( processIndicator.props.children.props.children ).toEqual( 'Unknown step progress' );
	} );

	it( 'throws error with one or more missing parameters', () => {
		console.error = jest.genMockFn();
		renderer.render( <ProgressIndicator /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();

		let errors = console.error.mock.calls;
		expect( errors[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Required prop `currentStepNumber` was not specified in `ProgressIndicator`." );
		expect( errors[ 1 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Required prop `totalSteps` was not specified in `ProgressIndicator`." );
	} );

	it( 'throws error with invalid prop types', () => {
		console.error = jest.genMockFn();
		renderer.render( <ProgressIndicator currentStepNumber={"test"} totalSteps={[]}/> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();

		let errors = console.error.mock.calls;
		expect( errors[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `currentStepNumber` of type `string` supplied to `ProgressIndicator`" );
		expect( errors[ 1 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `totalSteps` of type `array` supplied to `ProgressIndicator`" );
	} );
} );