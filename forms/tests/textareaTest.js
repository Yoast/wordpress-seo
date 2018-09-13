jest.unmock( "../Textarea" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Textarea from "../Textarea";

describe( "A Textarea component", () => {
	var renderer = new ReactShallowRenderer();

	it( "generates a textarea based on the props", () => {
		renderer.render( <Textarea name="customTextarea" /> );

		const result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "customTextarea" );
		expect( result.props.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		renderer.render( <Textarea /> );

		const result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "textarea" );
		expect( result.props.value ).toBe( "" );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Textarea value={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `value` of type `number` supplied to `Textarea`, expected `string`." );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Textarea name="customTextarea" onChange={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `onChange` of type `number` supplied to `Textarea`, expected `function`." );
	} );

	it( "receives focus when it's focus property is set", () => {
		// Cannot seem to simulate clicking / cannot read the focus property.
	} );
} );
