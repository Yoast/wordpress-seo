jest.unmock( "../../composites/Textfield" );

import React from "react";
import TestUtils from "react-addons-test-utils";
import Textfield from "../Textfield";

describe( "A Textfield component", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a textarea based on the props", () => {
		renderer.render( <Textfield name="customTextArea" label="Custom Textarea" onChange={() => {}} /> );

		let result = renderer.getRenderOutput();
		let children = result.props.children;

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
			.toContain( "Warning: Failed prop type: Required prop `label` was not specified in `Textfield`." );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Textfield label="customLabel" value={0} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `value` of type `number` supplied to `Textfield`, expected `string`." );
	} );

	it( "generates a multiline textarea based on the props", () => {
		renderer.render( <Textfield name="customTextArea" label="Custom Textarea" multiline={true} onChange={() => {}} /> );

		let result = renderer.getRenderOutput();
		let children = result.props.children;

		expect( result.type ).toBe( "div" );
		expect( children.length ).toEqual( 2 );

		// Test label
		expect( children[ 0 ].props.for ).toBe( "customTextArea" );
	} );
} );
