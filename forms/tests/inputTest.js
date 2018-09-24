jest.unmock( "../Input" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Input from "../Input";

describe( "Input", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates an input based on the props", () => {
		renderer.render( <Input type="text" name="textInput" /> );

		const result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "textInput" );
		expect( result.props.defaultValue ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		renderer.render( <Input /> );

		const result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "input" );
		expect( result.props.type ).toBe( "text" );
		expect( result.props.defaultValue ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are partially missing", () => {
		renderer.render( <Input name="textInput" /> );

		const result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "textInput" );
		expect( result.props.type ).toBe( "text" );
		expect( result.props.defaultValue ).toBe( "" );
	} );

	it( "generates a warning when a faulty input type is passed", () => {
		console.error = jest.genMockFn();
		renderer.render( <Input type="invalidType" /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `type` of value `invalidType` supplied to `Input`" );
	} );

	it( "generates an input based on the defaults and additional, optional attributes", () => {
		const optionalAttributes = {
			className: "custom-input-class",
			id: "custom-input-identifier",
		};

		renderer.render( <Input name="textInput" optionalAttributes={ optionalAttributes } /> );

		const result = renderer.getRenderOutput();

		expect( result.props.className ).toBe( "custom-input-class" );
		expect( result.props.id ).toBe( "custom-input-identifier" );
	} );

	it( "generates an input based on the defaults and an onChange event binding", () => {
		renderer.render( <Input name="textInput" onChange={ () => {} } /> );

		const result = renderer.getRenderOutput();

		expect( result.props.onChange ).toBeDefined();
		expect( typeof result.props.onChange ).toBe( "function" );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.genMockFn();

		renderer.render( <Input name="textInput" onChange={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `onChange` of type `number` supplied to `Input`, expected `function`." );
	} );
} );
