jest.unmock( "../ScreenReaderShortcut" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import ScreenReaderShortcut from "../ScreenReaderShortcut";
import Styles from "../Styles";
import { shallow } from "enzyme";

describe( "ScreenReaderShortcut", () => {
	const renderer = new ReactShallowRenderer();

	it( "generates a ScreenReaderShortcut div based on the props", () => {
		renderer.render( <ScreenReaderShortcut anchor="example">example text</ScreenReaderShortcut> );

		const result = renderer.getRenderOutput();

		expect( result.type ).toBe( "a" );
		expect( result.props.children ).toBe( "example text" );
		expect( result.props.style ).toBe( Styles.ScreenReaderText.default );
		expect( result.props.href ).toBe( "#example" );
		expect( result.props.className ).toBe( "screen-reader-shortcut" );
	} );

	it( "has the default styling when it's blurred and the focused styling when focused", () => {
		const result = shallow( <ScreenReaderShortcut anchor="example">example text</ScreenReaderShortcut> );
		expect( result.prop( "style" ) ).toBe( Styles.ScreenReaderText.default );
		result.find( "a" ).simulate( "focus" );
		expect( result.prop( "style" ) ).toBe( Styles.ScreenReaderText.focused );
		result.find( "a" ).simulate( "blur" );
		expect( result.prop( "style" ) ).toBe( Styles.ScreenReaderText.default );
	} );

	it( "generates a warning when props.children is not a string.", () => {
		console.error = jest.genMockFn();
		renderer.render( <ScreenReaderShortcut anchor="example"><div /></ScreenReaderShortcut> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `children` of type `object` supplied to " +
			            "`ScreenReaderShortcut`, expected `string`." );
	} );

	it( "generates a warning when props.anchor is not a string.", () => {
		console.error = jest.genMockFn();
		renderer.render( <ScreenReaderShortcut anchor={ 1 }>example text</ScreenReaderShortcut> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `anchor` of type `number` supplied to `ScreenReaderShortcut`, expected `string`." );
	} );

	it( "generates a warning when no children are passed in.", () => {
		console.error = jest.genMockFn();
		renderer.render( <ScreenReaderShortcut anchor="example" /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );

	it( "generates a warning when no anchor prop is passed in.", () => {
		console.error = jest.genMockFn();
		renderer.render( <ScreenReaderShortcut>example text</ScreenReaderShortcut> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );
} );
