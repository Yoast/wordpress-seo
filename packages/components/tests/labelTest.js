import React from "react";
import { render } from "@testing-library/react";
import Label from "../src/Label";

describe( "A Label component", () => {
	it( "generates a Label based on the props", () => {
		const { container } = render( <Label for="some-id">customLabel</Label> );

		const label = container.querySelector( "label" );

		expect( label.textContent ).toBe( "customLabel" );
		expect( label.htmlFor ).toBe( "some-id" );
	} );
} );
