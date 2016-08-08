jest.unmock("../forms/Progressbar");

import React from "react";
import TestUtils from "react-addons-test-utils";
import Progressbar from "../forms/Progressbar";

describe( "Progressbar", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a Progressbar based on the props", () => {
		renderer.render( <Progressbar name="customProgressbar" /> );

		let result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "customProgressbar" );
		expect( result.props.value ).toBe( 0 );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		console.error = jest.genMockFn();

		renderer.render( <Progressbar /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Required prop `name` was not specified" );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Progressbar value="0" /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `value` of type `string` supplied to `Progressbar`, expected `number`." );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Progressbar name="customProgressbar" onChange={0} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `onChange` of type `number` supplied to `Progressbar`, expected `function`." );
	} );

} );
