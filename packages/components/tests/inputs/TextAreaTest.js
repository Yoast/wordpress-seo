import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import TextArea from "../../src/inputs/TextArea";

describe( "TextArea", () => {
	const renderer = new ReactShallowRenderer();
	it( "should render with only required props", () => {
		renderer.render( <TextArea label="This is my label" /> );

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
	} );

	it( "should render based on provided props", () => {
		renderer.render(
			<TextArea
				label="This is my label"
				id="very-nice-id"
				linkTo="google"
				value="Nice value you got here!"
			/>
		);

		const result = renderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.linkTo ).toBe( "google" );
		expect( result.props.htmlFor ).toBe( "very-nice-id" );
		expect( result.props.children.props.value ).toBe( "Nice value you got here!" );
		expect( result.props.children.props.id ).toBe( "very-nice-id" );
	} );

	it( "generates an error if wrong props are provided", () => {
		console.error = jest.fn();

		renderer.render(
			<TextArea
				label="This is my label"
				id={ false }
			/>
		);

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] ).toBe( "Invalid prop `id` of type `boolean` supplied to `TextArea`, expected `string`." );
	} );
} );
