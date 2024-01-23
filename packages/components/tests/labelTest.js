import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Label from "../src/Label";

describe( "A Label component", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates a Label based on the props", () => {
		renderer.render( <Label for="">customLabel</Label> );

		const result = renderer.getRenderOutput();

		expect( result.props.children ).toBe( "customLabel" );
		expect( result.props.htmlFor ).toBe( "" );
	} );

	it( "generates a warning when a required prop `for` is missing", () => {
		console.error = jest.fn();

		renderer.render( <Label /> );

		expect( console.error ).toBeCalled();

		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] ).toBe( "The prop `for` is marked as required in `Label`, but its value is `undefined`." );
	} );

	it( "generates a warning when a faulty htmlFor prop is passed", () => {
		console.error = jest.fn();

		renderer.render( <Label for={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] ).toBe( "Invalid prop `for` of type `number` supplied to `Label`, expected `string`." );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.fn();

		renderer.render( <Label name="customLabel" optionalAttributes={ { onClick: 0 } } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] )
			.toBe( "Invalid prop `optionalAttributes.onClick` of type `number` supplied to `Label`, expected `function`." );
	} );
} );
