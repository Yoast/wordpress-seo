import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import TextInput from "../../src/inputs/TextInput";

describe( "TextInput", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates an input based on the props", () => {
		renderer.render(
			<TextInput
				type="text"
				name="textInput"
				label="Heya"
				linkTo="linkTo"
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result.props.label ).toBe( "Heya" );
		expect( result.props.linkTo ).toBe( "linkTo" );
		expect( result.props.children.props.name ).toBe( "textInput" );
		expect( result.props.children.props.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		renderer.render(
			<TextInput
				label="heya"
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result.props.children.props.name ).toBe( "" );
		expect( result.props.children.props.type ).toBe( "text" );
		expect( result.props.children.props.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are partially missing", () => {
		renderer.render(
			<TextInput
				label="heya"
				name="textInput"
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result.props.children.props.name ).toBe( "textInput" );
		expect( result.props.children.props.type ).toBe( "text" );
		expect( result.props.children.props.value ).toBe( "" );
	} );

	it( "generates a warning when a faulty input type is passed", () => {
		console.error = jest.fn();
		renderer.render( <TextInput label="hey" type="invalidType" /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] ).toContain( "Invalid prop `type` of value `invalidType` supplied to `TextInput`" );
	} );

	it( "generates an input based on the defaults and additional, optional attributes", () => {
		const optionalAttributes = {
			id: "custom-input-identifier",
		};

		renderer.render( <TextInput label="hi" name="textInput" { ...optionalAttributes } /> );

		const result = renderer.getRenderOutput();

		expect( result.props.id ).toBe( "custom-input-identifier" );
	} );

	it( "generates an input based on the defaults and an onChange event binding", () => {
		renderer.render( <TextInput label="hi" name="textInput" onChange={ () => {} } /> );

		const result = renderer.getRenderOutput();

		expect( result.props.onChange ).toBeDefined();
		expect( typeof result.props.onChange ).toBe( "function" );
	} );

	it( "generates a warning when a faulty onChange callback is passed", () => {
		console.error = jest.fn();

		renderer.render( <TextInput label="hi" name="textInput" onChange={ 0 } /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] )
			.toBe( "Invalid prop `onChange` of type `number` supplied to `TextInput`, expected `function`." );
	} );
} );
