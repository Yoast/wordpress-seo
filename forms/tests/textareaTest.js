jest.unmock("../Textarea");

import React from "react";
import TestUtils from "react-addons-test-utils";
import Textarea from "../Textarea";

describe( "A Textarea component", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a textarea based on the props", () => {
		renderer.render( <Textarea name="customTextarea" /> );

		let result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "customTextarea" );
		expect( result.props.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		renderer.render( <Textarea /> );

		let result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "textarea" );
		expect( result.props.value ).toBe( "" );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Textarea value={0} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `value` of type `number` supplied to `Textarea`, expected `string`." );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Textarea name="customTextarea" onChange={0} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `onChange` of type `number` supplied to `Textarea`, expected `function`." );
	} );

} );
