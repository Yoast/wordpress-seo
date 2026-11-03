jest.unmock( "../src/a11y/ScreenReaderText" );

import React from "react";
import { render } from "@testing-library/react";
import ScreenReaderText from "../src/a11y/ScreenReaderText";
import Styles from "../src/a11y/Styles";

describe( "ScreenReaderText", () => {
	it( "generates a ScreenReaderText div based on the props", () => {
		const { container } = render( <ScreenReaderText>example text</ScreenReaderText> );

		const result = container.firstChild;

		expect( result.tagName ).toBe( "SPAN" );
		expect( result.textContent ).toBe( "example text" );
		Object.entries( Styles.ScreenReaderText.default ).forEach( ( [ property, value ] ) => {
			expect( result.style[ property ] ).toBe( value );
		} );
		expect( result.className ).toBe( "screen-reader-text" );
	} );
} );
