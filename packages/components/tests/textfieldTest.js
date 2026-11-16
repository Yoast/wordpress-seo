import React from "react";
import { render } from "@testing-library/react";
import Textfield from "../src/Textfield";

describe( "A Textfield component", () => {
	it( "generates a textarea based on the props", () => {
		const { container } = render( <Textfield name="customTextArea" label="Custom Textarea" onChange={ () => {} } /> );

		const result = container.firstChild;
		const children = result.children;

		expect( result.tagName ).toBe( "DIV" );
		expect( children.length ).toEqual( 2 );

		// Test label
		expect( children[ 0 ].tagName ).toBe( "LABEL" );
		expect( children[ 0 ].htmlFor ).toBe( "customTextArea" );
	} );

	it( "generates a multiline textarea based on the props", () => {
		const { container } = render( <Textfield name="customTextArea" label="Custom Textarea" multiline={ true } onChange={ () => {} } /> );

		const result = container.firstChild;
		const children = result.children;

		expect( result.tagName ).toBe( "DIV" );
		expect( children.length ).toEqual( 2 );

		// Test label
		expect( children[ 0 ].tagName ).toBe( "LABEL" );
		expect( children[ 0 ].htmlFor ).toBe( "customTextArea" );
	} );
} );
