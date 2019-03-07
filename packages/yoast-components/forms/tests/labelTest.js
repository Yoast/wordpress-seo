jest.unmock( "../Label" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Label from "../Label";

describe( "A Label component", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates a Label based on the props", () => {
		renderer.render( <Label for="">customLabel</Label> );

		const result = renderer.getRenderOutput();

		expect( result.props.children ).toBe( "customLabel" );
		expect( result.props.htmlFor ).toBe( "" );
	} );

	it( "generates a warning when a required prop `for` is missing", () => {
		console.error = jest.genMockFn();

		renderer.render( <Label /> );

		expect( console.error ).toBeCalled();

		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );

	it( "generates a warning when a faulty htmlFor prop is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Label for={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `for` of type `number` supplied to `Label`, expected `string`." );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Label name="customLabel" optionalAttributes={ { onClick: 0 } } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );
} );
