jest.unmock("../forms/Label");

import React from "react";
import TestUtils from "react-addons-test-utils";
import Label from "../forms/Label";

describe( "A Label component", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a Label based on the props", () => {
		renderer.render( <Label text="customLabel" /> );

		let result = renderer.getRenderOutput();

		expect( result.props.children ).toBe( "customLabel" );
		expect( result.props.htmlFor ).toBe( "" );
	} );

	it( "generates a warning when a required prop is missing", () => {
		console.error = jest.genMockFn();

		renderer.render( <Label /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Required prop `text` was not specified" );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Label text={0} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `text` of type `number` supplied to `Label`, expected `string`." );
	} );

	it( "generates a warning when a faulty for prop is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Label for={0} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `for` of type `number` supplied to `Label`, expected `string`." );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Label name="customLabel" onClick={0} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `onClick` of type `number` supplied to `Label`, expected `function`." );
	} );

} );
