jest.unmock("../ScreenReaderText");

import React from "react";
import TestUtils from "react-addons-test-utils";
import ScreenReaderText from "../ScreenReaderText";
import Styles from "../Styles";

describe( "ScreenReaderText", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a ScreenReaderText div based on the props", () => {
		renderer.render( <ScreenReaderText>example text</ScreenReaderText> );

		let result = renderer.getRenderOutput();

		expect( result.props.children ).toBe( "example text" );
		expect( result.props.style).toBe( Styles.ScreenReaderText.default );
		expect( result.props.className).toBe( "screen-reader-text" );
	} );

	it( "generates a warning when props.children is not a string.", () => {
		console.error = jest.genMockFn();
		renderer.render( <ScreenReaderText><div></div></ScreenReaderText> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `children` of type `object` supplied to `ScreenReaderText`, expected `string`." );
	} );

	it( "generates a warning when no children are passed in.", () => {
		console.error = jest.genMockFn();
		renderer.render( <ScreenReaderText /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Required prop `children` was not specified in `ScreenReaderText`." );
	} );
} );
