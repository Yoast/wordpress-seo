jest.unmock( "../src/a11y/ScreenReaderText" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import ScreenReaderText from "../src/a11y/ScreenReaderText";
import Styles from "../src/a11y/Styles";

describe( "ScreenReaderText", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates a ScreenReaderText div based on the props", () => {
		renderer.render( <ScreenReaderText>example text</ScreenReaderText> );

		const result = renderer.getRenderOutput();

		expect( result.type ).toBe( "span" );
		expect( result.props.children ).toBe( "example text" );
		expect( result.props.style ).toBe( Styles.ScreenReaderText.default );
		expect( result.props.className ).toBe( "screen-reader-text" );
	} );

	it( "generates a warning when props.children is not a string.", () => {
		console.error = jest.fn();
		renderer.render( <ScreenReaderText><div /></ScreenReaderText> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `children` of type `object` supplied to `ScreenReaderText`, expected `string`." );
	} );

	it( "generates a warning when no children are passed in.", () => {
		console.error = jest.fn();
		renderer.render( <ScreenReaderText /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );
} );
