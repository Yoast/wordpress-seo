jest.unmock( "../Progressbar" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Progressbar from "../Progressbar";

describe( "A Progressbar component", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates a Progressbar based on the props", () => {
		renderer.render( <Progressbar name="customProgressbar" value={ 0 } /> );

		const result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "customProgressbar" );
		expect( result.props.value ).toBe( 0 );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		console.error = jest.genMockFn();

		renderer.render( <Progressbar /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );

	it( "generates a warning when a faulty value is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Progressbar value="0" /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `value` of type `string` supplied to `Progressbar`, expected `number`." );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Progressbar name="customProgressbar" onChange={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `onChange` of type `number` supplied to `Progressbar`, expected `function`." );
	} );

	it( "generates a progressbar based on the defaults and additional, optional attributes", () => {
		const optionalAttributes = {
			className: "custom-progress-class",
			id: "custom-progress-identifier",
		};

		renderer.render( <Progressbar name="customProgressbar" optionalAttributes={ optionalAttributes } /> );

		const result = renderer.getRenderOutput();

		expect( result.props.className ).toBe( "custom-progress-class" );
		expect( result.props.id ).toBe( "custom-progress-identifier" );
	} );

	it( "generates a fallback progressbar", () => {
		renderer.render( <Progressbar value={ 10 } max={ 100 } forceFallback={ true } name="customProgressbar" /> );

		const result = renderer.getRenderOutput();

		expect( result.type ).toBe( "div" );
		expect( result.props.style.width ).toBe( "10%" );
	} );
} );
