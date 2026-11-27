import React from "react";
import { render, screen } from "@testing-library/react";
import TextArea from "../../src/inputs/TextArea";

describe( "TextArea", () => {
	it( "should render with only required props", () => {
		const { container } = render( <TextArea label="This is my label" /> );

		const result = container.firstChild;

		expect( result ).not.toBeNull();
	} );

	it( "should render based on provided props", () => {
		const { container } = render(
			<TextArea
				label="This is my label"
				id="very-nice-id"
				linkTo="google"
				value="Nice value you got here!"
			/>
		);

		const textarea = screen.getByRole( "textbox" );

		expect( container.querySelector( "a.yoast-help" ).getAttribute( "href" ) ).toBe( "google" );
		expect( screen.getByText( "This is my label" ).htmlFor ).toBe( "very-nice-id" );
		expect( textarea.value ).toBe( "Nice value you got here!" );
		expect( textarea.id ).toBe( "very-nice-id" );
	} );
} );
