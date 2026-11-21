import React from "react";
import { render } from "@testing-library/react";
import ScreenReaderText from "../src/a11y/ScreenReaderText";
import Styles from "../src/a11y/Styles";

describe( "ScreenReaderText", () => {
	it( "generates a ScreenReaderText span based on the props", () => {
		const { container } = render( <ScreenReaderText>example text</ScreenReaderText> );

		const result = container.firstChild;

		expect( result.tagName ).toBe( "SPAN" );
		expect( result.textContent ).toBe( "example text" );
		// Apply the expected styles to a reference element, so shorthands expand the same way on both sides.
		const expectedStyle = document.createElement( "span" ).style;
		Object.assign( expectedStyle, Styles.ScreenReaderText.default );
		expect( result.style.cssText ).toBe( expectedStyle.cssText );
		expect( result.className ).toBe( "screen-reader-text" );
	} );
} );
