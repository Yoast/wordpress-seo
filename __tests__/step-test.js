jest.unmock( '../js/step' );

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Step from '../js/step';

describe( 'step component', () => {

	let inputProps = {
		id: '',
		title: 'Title',
		fields: {},
		components: {},
		currentStep: ''
	};

	let renderer = TestUtils.createRenderer();
	renderer.render( <Step {...inputProps} /> );

	let stepComponent = renderer.getRenderOutput();

	it( 'has div container with correct id', () => {
		expect( stepComponent.type ).toEqual( 'div' );
		expect( stepComponent.props.id ).toEqual( 'stepContainer' );
	} );

	it( 'has a h1 header title', () => {
		let header = stepComponent.props.children[ 0 ];

		expect( header.type ).toEqual( 'h1' );
		expect( header.props.children ).toEqual( [ 'Step: ', inputProps.title ] );
	} );

	it( 'throws an error when required property title is missing', () => {
		console.error = jest.genMockFn();

		renderer.render( <Step /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Required prop `title` was not specified in `Step`" );
	} );

	it( 'throws an error when property fields is not an object ', () => {
		console.error = jest.genMockFn();

		let inputProps = {
			fields: '',
			title: 'Title',
		};

		renderer.render( <Step {...inputProps} /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `fields` of type `string` supplied to `Step`," +
			            " expected `object`." );
	} );

	it( 'throws an error property title is not a string', () => {
		console.error = jest.genMockFn();

		let inputProps = {
			title: 1,
		};

		renderer.render( <Step {...inputProps} /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `title` of type `number` supplied to `Step`, expected `string`." );
	} );

	it( 'throws an error when property components is not an object', () => {
		console.error = jest.genMockFn();

		let inputProps = {
			title: 'Title',
			components: []
		};

		renderer.render( <Step {...inputProps} /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `components` of type `array` supplied to `Step`, expected `object`." );
	} );

	it( 'throws an error when property currentStep is not a string', () => {
		console.error = jest.genMockFn();

		let inputProps = {
			title: 'Title',
			currentStep: false
		};

		renderer.render( <Step {...inputProps} /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `currentStep` of type `boolean` supplied to `Step`, expected `string`." );
	} );

} );