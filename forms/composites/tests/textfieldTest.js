jest.unmock( "../../composites/Textfield" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Textfield from "../Textfield";

describe( "A Textfield component", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates a textarea based on the props", () => {
		renderer.render( <Textfield name="customTextArea" label="Custom Textarea" onChange={ () => {} } /> );

		const result = renderer.getRenderOutput();
		const children = result.props.children;

		expect( result.type ).toBe( "div" );
		expect( children.length ).toEqual( 2 );

		// Test label
		expect( children[ 0 ].props.for ).toBe( "customTextArea" );
	} );

	it( "generates a warning when no label is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Textfield /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Textfield label="customLabel" value={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `value` of type `number` supplied to `Textfield`, expected `string`." );
	} );

	it( "generates a multiline textarea based on the props", () => {
		renderer.render( <Textfield name="customTextArea" label="Custom Textarea" multiline={ true } onChange={ () => {} } /> );

		const result = renderer.getRenderOutput();
		const children = result.props.children;

		expect( result.type ).toBe( "div" );
		expect( children.length ).toEqual( 2 );

		// Test label
		expect( children[ 0 ].props.for ).toBe( "customTextArea" );
	} );
} );
