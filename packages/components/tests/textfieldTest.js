import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Textfield from "../src/Textfield";

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
		console.error = jest.fn();

		renderer.render( <Textfield /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] )
			.toBe( "The prop `label` is marked as required in `Textfield`, but its value is `undefined`." );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.fn();

		renderer.render( <Textfield label="customLabel" value={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] ).toBe( "Invalid prop `value` of type `number` supplied to `Textfield`, expected `string`." );
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
